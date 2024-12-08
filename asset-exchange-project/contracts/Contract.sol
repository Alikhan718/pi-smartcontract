// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract {
    struct Asset {
        address owner;
        string details;
        bool exists;
    }

    struct Listing {
        uint256 assetId;
        uint256 desiredAssetId;
        address lister;
        bool active;
    }

    struct TradeProposal {
        address proposer;
        uint256 offeredAssetId;
        uint256 requestedAssetId;
        bool accepted;
        bool exists;
    }

    mapping(uint256 => Asset) public assets;
    uint256 public assetCounter;

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    mapping(uint256 => mapping(uint256 => TradeProposal)) public proposals;
    mapping(uint256 => uint256) public proposalCounterForListing;

    event AssetRegistered(uint256 indexed assetId, address indexed owner, string details);
    event AssetListed(uint256 indexed listingId, uint256 indexed assetId, uint256 desiredAssetId, address indexed lister);
    event TradeProposed(uint256 indexed listingId, uint256 indexed proposalId, address indexed proposer, uint256 offeredAssetId, uint256 requestedAssetId);
    event TradeAccepted(uint256 indexed listingId, uint256 indexed proposalId, uint256 offeredAssetId, uint256 requestedAssetId, address oldOwner, address newOwner);
    event ListingClosed(uint256 indexed listingId);

    modifier onlyAssetOwner(uint256 _assetId) {
        require(assets[_assetId].exists, "Asset does not exist");
        require(assets[_assetId].owner == msg.sender, "Caller is not the owner of this asset");
        _;
    }

    function getAsset(uint256 _assetId) external view returns (address owner, string memory details, bool exists) {
        require(assets[_assetId].exists, "Asset does not exist");
        return (assets[_assetId].owner, assets[_assetId].details, assets[_assetId].exists);
    }

    function getListing(uint256 _listingId) external view returns (uint256 assetId, uint256 desiredAssetId, address lister, bool active) {
        require(listings[_listingId].lister != address(0), "Listing does not exist");
        Listing memory listing = listings[_listingId];
        return (listing.assetId, listing.desiredAssetId, listing.lister, listing.active);
    }

    function getProposal(uint256 _listingId, uint256 _proposalId) external view returns (address proposer, uint256 offeredAssetId, uint256 requestedAssetId, bool accepted, bool exists) {
        require(proposals[_listingId][_proposalId].exists, "Proposal does not exist");
        TradeProposal memory trade = proposals[_listingId][_proposalId];
        return (trade.proposer, trade.offeredAssetId, trade.requestedAssetId, trade.accepted, trade.exists);
    }

    function registerAsset(string memory _details) external returns (uint256 assetId) {
        assetCounter++;
        assets[assetCounter] = Asset({
            owner: msg.sender,
            details: _details,
            exists: true
        });

        emit AssetRegistered(assetCounter, msg.sender, _details);
        return assetCounter;
    }

    function listAssetForTrade(uint256 _assetId, uint256 _desiredAssetId) external onlyAssetOwner(_assetId) returns (uint256 listingId) {
        listingCounter++;
        listings[listingCounter] = Listing({
            assetId: _assetId,
            desiredAssetId: _desiredAssetId,
            lister: msg.sender,
            active: true
        });

        emit AssetListed(listingCounter, _assetId, _desiredAssetId, msg.sender);
        return listingCounter;
    }

    function proposeTrade(uint256 _listingId, uint256 _offeredAssetId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.lister != address(0), "Invalid listing");
        require(assets[_offeredAssetId].exists, "Offered asset does not exist");
        require(assets[_offeredAssetId].owner == msg.sender, "You must own the offered asset");

        proposalCounterForListing[_listingId]++;
        uint256 proposalId = proposalCounterForListing[_listingId];

        proposals[_listingId][proposalId] = TradeProposal({
            proposer: msg.sender,
            offeredAssetId: _offeredAssetId,
            requestedAssetId: listing.assetId,
            accepted: false,
            exists: true
        });

        emit TradeProposed(_listingId, proposalId, msg.sender, _offeredAssetId, listing.assetId);
    }

    function acceptTrade(uint256 _listingId, uint256 _proposalId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.lister == msg.sender, "Only the listing owner can accept trades");
        require(proposals[_listingId][_proposalId].exists, "Proposal does not exist");
        require(!proposals[_listingId][_proposalId].accepted, "Proposal already accepted");

        TradeProposal storage trade = proposals[_listingId][_proposalId];

        require(assets[trade.offeredAssetId].owner == trade.proposer, "Proposer no longer owns the offered asset");
        require(assets[trade.requestedAssetId].owner == listing.lister, "Lister no longer owns the requested asset");

        address oldOwnerRequested = assets[trade.requestedAssetId].owner;

        // Perform atomic swap
        assets[trade.requestedAssetId].owner = trade.proposer;
        assets[trade.offeredAssetId].owner = listing.lister;

        trade.accepted = true;
        listing.active = false;

        emit TradeAccepted(
            _listingId,
            _proposalId,
            trade.offeredAssetId,
            trade.requestedAssetId,
            oldOwnerRequested,
            trade.proposer
        );
        emit ListingClosed(_listingId);
    }
}

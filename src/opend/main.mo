import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";

import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Prelude "mo:base/Prelude";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

// importing NFT class 
import NFTActorClass "../NFT/nft";

actor OpenD {
   
   // defining a custom datatype to store listed Nfts data 
   private type Listing ={
       itemOwner : Principal;
       itemPrice : Nat;

   };
   // we will use this in  the map of NFTs listed 

   var mapOfNFTs = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
   // now we also need a hashmap to map all the nfts with a particular id
   // as any owner can own more than one nft 
   // hashmap  -> (key,value) --- (principal,list)
   var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);
   // map to keep track of all the listings for sell (NFTs)
   var mapOfListings =  HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);


   public shared(msg) func mint(imagData : [Nat8] ,  name : Text ): async Principal{
       let owner : Principal = msg.caller;
    //    owner will be principal id of the authenticated anonomus user 
       Cycles.add(100_500_000_000);

       let newNFT = await NFTActorClass.NFT(name,owner, imagData );
       let newNFTPrincipal = await newNFT.getCanisterId();

      //  add the nft and its principal id in the hashmap now 

       mapOfNFTs.put(newNFTPrincipal,newNFT);

      addToOwnershipMap(owner, newNFTPrincipal);

       return  newNFTPrincipal;
   };

   private func addToOwnershipMap(owner : Principal , nftId : Principal){
         //   nftId is the newly minted nft which we want to add to the users list 
         var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)){
            case null List.nil<Principal>();
            case (?result) result;
         };
         
         ownedNFTs := List.push(nftId,ownedNFTs);
         mapOfOwners.put(owner, ownedNFTs);

   };

   // function to convert list of ids into array to be used on the frontend 
   public query func getOwnedNFTs(user:Principal ) : async [Principal]{
      var userNFTs : List.List<Principal> = switch( mapOfOwners.get(user) ) {
            case null List.nil<Principal>();
            case (?result) result;
      };

      return List.toArray(userNFTs);
   };


//  function to return all the listed NFT ids to the frontend 
// to show them on the discover page 

   public query func  getListedNFTs() : async [Principal]{
      let ids =  Iter.toArray(mapOfListings.keys());
      Debug.print(debug_show (ids));
      return ids;
   };

   public shared(msg) func listItem(id : Principal , price : Nat) : async Text{
       var item : NFTActorClass.NFT =  switch (mapOfNFTs.get(id)){
         case null return "NFT doesnot exist";
         case (?result) result;
       };
      //  mow we need to checck the person whoo is calling this function 
      //  is owner of the nft or not We can do this using getOwner function 
      // from the nft class
      let owner = await  item.getOwner();
      if(Principal.equal(owner,msg.caller)){
         // in this case we will create new Listing 
         let newListing : Listing={
            itemOwner = owner;
            itemPrice = price;
         };
         mapOfListings.put(id,newListing);
         return "Success";
      }else{
         return "You don't own the NFT";
      }
       
   };

   // Now  as we will sell our NFTs to openD cannister we will need its ID
   public query func getOpenDCannisterID() : async Principal{
      return Principal.fromActor(OpenD);
   };

   // now a fucntion to hold the values of the listed nfts and their owners 
   public query func isListed(id : Principal ) : async Bool{
      Debug.print(debug_show (id));
      // debug_show(id.'');
      if(mapOfListings.get(id) == null){
         return false;
      }else{
         return true;
      }
   }
};

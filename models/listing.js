const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//Schema

const listingSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  description: String,  

  image: {
    type: String,
    default: " https://p.turbosquid.com/ts-thumb/do/7Hsr2p/Cy/02/jpg/1644608755/600x600/fit_q87/7d478dea9398a5d4d2b93d380669dafb10e97d75/02.jpg",
    set: function (v) {
      if (!v) return this.schema.paths.image.defaultValue;
      if (typeof v === "object") return v.url || JSON.stringify(v);
      return v;
    }
  },
  
  price: Number,

  location: String,

  country: String,

  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

});


listingSchema.post("findOneAndDelete" ,async(listing) =>{
  if(listing){
      await Review.deleteMany({_id: {$in: listing.reviews}});
  };
}); 

//model

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
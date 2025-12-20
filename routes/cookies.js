const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();

//cookies

router.use(cookieParser("secretcode"));

router.get("/getSignedCookies" ,(req,res) =>{
    res.cookie("made-In" , "India", {signed: true});
    res.send("Signed Cookie Send!");
});
router.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("Verified!!");

});

router.get("/getCookies" , (req,res)=>{ //http://localhost:8080/cookies/getCookies
  res.cookie("Greet","Namaste");
  res.cookie("Origin","India");
  res.send("Sent you some cookies");
});

//cookie parser
router.get("/cookies" , (req,res)=>{  //http://localhost:8080/cookies/cookies
  console.dir(req.cookies);
  res.send("Hi, I am Root!");
});

module.exports = router;


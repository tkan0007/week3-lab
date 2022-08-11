const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
let express = require('express');
let router = express.Router();

let url = require("url");

// Database is an array of records
let db = [];
//First record
let rec = {};

rec = {
    id:1,
    title:"Monash",
    author: "John Monash",
    topic: "University",
    cost: 100,
};
//Insert the first record to the db
db.push(rec);


router.get("/", function (req, res) {
    let count = db.length;
    res.send("<h2>Hello</h2> </br>"+"Currently "+count+" books are recorded.</br>Book ID is the random number from 0 - 1000 </br> <h3>Each links for lab task are below</h3><ol><li><a href= http://localhost:8080/getallbooks>Show the list of book in store</a></li><li><a href=http://localhost:8080/getbookstorevalue>Check the total value of book in store<a></li><li>To add new Book URL:http://localhost:8080/addbook?title=&author=&topic=&cost=</br><a href=http://localhost:8080/addbook?title=Harry%20Potter&author=%20J.K.%20Rowling&topic=fiction&cost=15>Add Harry Potter<a/></li><li>To delete the book URL: http://localhost:8080/deleteid/</br><a href=http://localhost:8080/deleteid/1>Delete Monash</a></li></ol>");
});

router.get("/getallbooks", function (req, res) {
    res.send(generateList());
});

router.get("/addbook", function (req, res) {
    let baseURL = "http://" + req.headers.host + "/";
    let url = new URL(req.url, baseURL);
    let params = url.searchParams;
    let newId = getRandomNumber();
    console.log(params);
    let newRec = {
        id:newId,
        title:params.get("title"),
        author:params.get("author"),
        topic:params.get("topic"),
        cost:params.get("cost"),
    };
    db.push(newRec);
    res.send(generateList());
});

router.get("/deleteid/:id", function (req, res) {
    if(db.length == 1){
        res.send("You cannot delete a record when there is only one record.")
    }else{
        console.log(deleteid(req.params.id));
        res.send(generateList());
    }
});

router.get("/deletetopic/:topic", function (req,res){
    let count = 0;
    let msg = "";
    if(db.length == 0){
        msg = "There is no record in database.";
    }else{
        count = deleteBytopic(req.params.topic);
        //count = partiallyWork(req.params.topic);
        //count = complecateDelete(req.params.topic);
    }

    if(count > 0){
        msg = count + " records were deleted.";
    }
    return res.send(msg);
});

router.get("/getbookstorevalue",function(req,res){
    res.send(calcTotalCost());
})


function deleteid(id) {
    let msg="";
    for(let i =0;i<db.length;i++){
        if(db[i].id == id){
            db.splice(i, 1);
            msg = id + " was deleted.";
            break;
        }else{
            msg = id + "was not found.";
        }
    }
    return msg;
}

function deleteBytopic(topic){
    var check = new Boolean(true);
    let count = 0;
    for(let i = 0;i<db.length;i++){
        if(db[i].topic == topic){
            db.splice(i,1);
            i = 0;
            count++;
        }
    }

    return count;
}

function partiallyWork(topic){
    let count =0;
    for(let i =0; i<db.length;i++){
        if(db[i].topic == topic){
            db.splice(i,1);
            count++;
        }
    }
    return count;
}

function complecateDelete(topic){
    let count = 0;
    var check = new Boolean(true);

    while(check){
        for(let i=0;i<db.length;i++){
            if(db[i].topic == topic){
                db.splice(i,1);
                count++;
            }
        }
        for(let j=0;j<db.length;j++){
            if(db[j].topic == topic){
                break;
            }else if(j == (db.length -1)){
                check = false;
            }
        }
    }
    return count;
}
function generateList() {
    let st = "ID  Title   Author Topic Cost </br>";
    for (let i = 0; i < db.length; i++) {
        st += db[i].id+" | "+db[i].title + " | " + db[i].author + " | " + db[i].topic +" | "+db[i].cost + "</br>";
    }
    return st;
}
function getRandomNumber(){
    var newId = Math.round((Math.random()*1000));
    var checksum = 1;
    while(checksum == 1){
        for(let i =0; i<db.length;i++){
            if(db[i].id == newId){
                console.log("Regenerate ID")
                newId = Math.round((Math.random()*100));
                break;
            }

            if(i == (db.length-1) && db[i].id != newId){
                checksum = 0;
            }
        }
    }
    console.log(newId);
    return newId;
}

function calcTotalCost(){
    let st = "Total cost of books in store is $";
    var totalCost = 0;
    for(let i = 0; i < db.length; i++){
        totalCost += parseInt(db[i].cost);
    }
    let msg = st + totalCost;
    return msg;
}

module.exports=router;

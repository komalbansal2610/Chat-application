const express=require('express');
const cors=require('cors');
const app=express();
const http=require('http').createServer(app);
const io=require('socket.io')(http,{
    cors:{
        origin:'*'
    }
});

app.get('/',(req,res)=>{
    res.send("hello world");
})    

let userList=new Map();

io.on('connection',(socket)=>{ 
    let userName=socket.handshake.query.userName;
    addUser(userName,socket.id);
    // socket.broadcast.emit('user',[...userList.keys()]);
    socket.broadcast.emit('user-list',{user:userName,mine:false});
    socket.emit('user-list',{user:userName,mine:true});
    socket.emit('user',[...userList.keys()]);
    // socket.emit('user-list',[...userList.keys()]);
    socket.on('message',(obj)=>{
        socket.broadcast.emit('message-broadcast',{message:obj.msg,userName:userName,time:obj.time});
    })

    // socket.on('disconnect',(reason)=>{
    //     removeUser(userName,socket.id);
    // })

});

function addUser(userName,id){
    if(!userList.has(userName))
    {
        userList.set(userName,new Set(id));
    }
    else
    {
        userList.get(userName).add(id);
    }
 
}

function removeUser(userName,id)
{
    if(userList.has(userName))
    {
        let userIds=userList.get(userName);
        if(userIds.size==0)
        {
            userList.delete(userName);
        }
    }
}



http.listen(3000,(error)=>{
    if(error)
    {
        throw error;
    }
    console.log("server started successfully");
})
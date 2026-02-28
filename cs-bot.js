let flows = {};
const chatBody = document.getElementById("chatBody");

// ==========================
// LOAD FLOWS JSON
// ==========================
async function loadFlows(){

    try{
        const res = await fetch("flows.json");
        flows = await res.json();
        startBot();
    }catch(err){
        console.error("Gagal load flows.json", err);
    }

}

// ==========================
// START BOT
// ==========================
function startBot(){

    addMessage(flows.menu.reply,"bot");
    showButtons(flows.menu.next);

}

// ==========================
// ADD MESSAGE
// ==========================
function addMessage(text,type){

    const msg=document.createElement("div");
    msg.className="message "+type;
    msg.innerText=text;

    chatBody.appendChild(msg);

    chatBody.scrollTo({
        top:chatBody.scrollHeight,
        behavior:"smooth"
    });

}

// ==========================
// TYPING EFFECT
// ==========================
function showTyping(callback){

    const typing=document.createElement("div");
    typing.className="typing";
    typing.innerHTML="<span></span><span></span><span></span>";

    chatBody.appendChild(typing);

    chatBody.scrollTo({
        top:chatBody.scrollHeight,
        behavior:"smooth"
    });

    setTimeout(()=>{
        typing.remove();
        callback();
    },1000 + Math.random()*800);

}

// ==========================
// SHOW BUTTONS
// ==========================
function showButtons(list){

    const wrapper=document.createElement("div");
    wrapper.className="quick";

    list.forEach(item=>{

        const btn=document.createElement("button");
        btn.innerText=item.text;

        btn.onclick=()=>{
            sendFlow(item.key,item.text);
        };

        wrapper.appendChild(btn);

    });

    chatBody.appendChild(wrapper);

}

// ==========================
// SEND FLOW
// ==========================
function sendFlow(key,label){

    addMessage(label,"user");

    showTyping(()=>{

        if(!flows[key]) return;

        addMessage(flows[key].reply,"bot");
        showButtons(flows[key].next);

    });

}

// ==========================
// INIT
// ==========================
loadFlows();

function findFAQ(text){
   text=text.toLowerCase();

   for(let item of faq){
      if(item.keywords.some(k=>text.includes(k))){
         return item.reply;
      }
   }
   return null;
}
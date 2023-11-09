let socket = io();
let userId;
let tableId;
let color;
let turn;

let sessionTableId= window.sessionStorage.getItem("tableId");

let sessionUserId= window.sessionStorage.getItem("userId");


if(sessionTableId&& sessionUserId){
  $("#gameInfoBox").addClass("d-none");
  let signupData={
    eventName:'SIGN_UP',
    data:{
      userId:sessionUserId,
      tableId:sessionTableId,
    }
  }
  sendToSocket(socket,signupData);
}
// console.log("userid=",data);
console.log("userid=",tableId);

function submitEvent() {
  $("form").submit((e) => {
    let userName = $("#userName").val();
    e.preventDefault();
    let signupData = {
      eventName: "SIGN_UP",
      data: {
        userName: userName,
        isBot: false
      }
    };
    // Further code goes here, if needed.
  

    
    sendToSocket(socket, signupData);
    $("form").addClass().addClass("hide");
    setTimeout(() => {
      $("form").addClass("d-none");
    }, 500);
  });
}
submitEvent();

function setBoard(data) {

  let board = data.board;
  document.querySelectorAll(".tile").forEach((element, index) => {
    row = Math.floor(index / 8);
    col = index - row * 8;
    if (board[row][col] == 2) {
      element.innerHTML = `<div class="dice black_dice" id="b"><img src="image/black.png" alt=""></div>`;
    } else if (board[row][col] == 1) {
      element.innerHTML = `<div class="dice red_dice" id="r"><img src="image/red.png" alt=""></img>`;
    } else if (board[row][col] == 5) {
      element.innerHTML = `<div class="dice black_dice king" id="b"><img src="image/black_king.png" alt=""></img>`;
    } else if (board[row][col] == 8) {
      element.innerHTML = `<div class="dice red_dice king" id="r"><img src="image/red_king.png" alt=""></img>`
    }
    else {
      element.innerHTML = "";
    }
  });
  if (color == 1) {

    $("#playerScore").html(`<img src="./image/red.png" alt=""><p >${data.score[0]}</p>`)
    $("#animeScore").html(`<img src="./image/black.png" alt=""><p >${data.score[1]}</p>`)
  } else {
    $("#playerScore").html(`<img src="./image/black.png" alt=""><p >${data.score[1]}</p>`)
    $("#animeScore").html(`<img src="./image/red.png" alt=""><p >${data.score[0]}</p>`)
  }
}

function setDiceEvent() {
  let dice;
  
  if (color == 1) {
      $("#board").addClass('rotate');
    dice = document.querySelectorAll(".red_dice");
  } else {
    dice = document.querySelectorAll(".black_dice");
  }
  dice.forEach((element) => {
    element.addEventListener("click", () => {
      let king = element.classList.contains("king");
      let parentElement = element.parentElement;
      $("#board").children().removeClass("active");
      $(".tile").children().removeClass("possible");
      parentElement.classList.add("active");
      let possibilityData = {
        eventName: "CHECK_POSSIBILITY",
        data: {
          index: parseInt(parentElement.id.slice(1)),
          userId,
          color,
        },
      };
      if (king) {
        possibilityData.data.color = (color == 2) ? 5 : 8;
      }
      sendToSocket(socket, possibilityData);
    });
  });
}

function sinUp(data) {
  console.log('signUpGame data :: >>', data)
  userId = data.userId;
  window.sessionStorage.setItem("userId",userId);
  if(color && color==1){
    $("#board").addClass('rotate');
  }
}

function joinGame(data) {
  if (data.status == "waiting")  {
    $("#gameInfoBox").html( `
    
    <div class="waiting_content">
      <div class="center">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <h2>waiting for other player...</h2>
    </div>`);
    // document.getElementById('userName').innerHTML = data.playerInfo[0].name
  } else {
    window.sessionStorage.setItem("tableId",data.tableId);
    // console.log("join tabl;e user data================> ",.data);
    console.log("------------------------------->",userId);
   
    console.log("------------------------------->",userId);
    console.log("join tabl;e user data================>",data.playerInfo);
    console.log("join tabl;e user data=================+++++> ",data);
    if (data.playerInfo[0]._id === userId) {
      color = 1;
      $("#playerName").html(data.playerInfo[0].userName);
      data.playerInfo[1]? $("#animeName").html(data.playerInfo[1].userName):"";
    } else {
      color = 2;
      // $("#playerName").html(data.playerInfo[1].userName);
      data.playerInfo[1]? $("#playerName").html(data.playerInfo[1].userName):"";
      $("#animeName").html(data.playerInfo[0].userName);
    }
    setBoard(data);
  }
}

function checkPossibility(data) {
  console.log('userstarted event called=======>');
  if (data.userId == userId) {
    let king = document.querySelector(".active .dice").classList.contains('king');

    if (data.killRow && data.killRow.length > 0) {
      for (var i = 0; i < data.killRow.length; i++) {
        let element = data.killRow[i];
        let id = element * 8 + data.killCol[i] + 1;
        document.getElementById(
          `b${id}`
        ).innerHTML = `<div class="possible kill"></div>`;
        setMoveEvent(id, king, data.kill[i]);
      }
    }
    data.row.forEach((element, index) => {
      let id = element * 8 + data.col[index] + 1;
      document.getElementById(
        `b${id}`
      ).innerHTML = `<div class="possible"></div>`;
      setMoveEvent(id, king);
    });
  }
}

function setMoveEvent(id, king, kill) {
  let element = document.querySelector(`#b${id} .possible`);
  element.addEventListener("click", () => {
    let currentId = document.querySelector(".active").id;

    let moveData = {
      eventName: "MOVE",
      data: {
        id: currentId,
        moveId: `b${id}`,
        color,
        userId,
        kill
      },
    };
    if (king) {
      moveData.data.color = (color == 2) ? 5 : 8;
    }
    sendToSocket(socket, moveData);
  });
  $(".possible").off("click");
}

function move(data) {
  setBoard(data);
  $("#board").children().removeClass("active");
}

function roundTimer(data) {
  let second = data.delayTime;
  var timer = setInterval(() => {
    if (second == 0) {
      clearInterval(timer);
      $("#gameInfoBox").html(``);
    } else {
      $("#gameInfoBox").html(`<div class='timeSecond'>${second--}</div>`);
    }
  }, 800);
}

function userTurnStart(data) {
  console.log('userTurnStarted data :: >>', data)

  let userId = data.userId
  console.log('join vvvvvv userId :: >>', userId)

  if (userId == userId) {
    turn = true;
    if (turn) {
      $("#playerName").addClass("playerActive");
      $("#animeName").removeClass("playerActive");
    }
    setDiceEvent();
  } else {
    turn = false;
    if (!turn) {
      $("#playerName").removeClass("playerActive");
      $("#animeName").addClass("playerActive");
    }
  }
}


function winGame(data) {
  $(" #gameInfoBox").addClass('show')
 
  let winnerId = data.winnerId;

  if (winnerId == userId) {
   
    console.log("winner------------------------------>",winnerId);
    $("#gameInfoBox").addClass("win-box");
    $("#gameInfoBox").html(`<img src="./image/win.png" alt="">`);
    $("#board").hide();
  }
   else {
    console.log("looser------------------------------>",userId);
    $("#gameInfoBox").addClass("lose-box");

    console.log("looser---fsdss--------------------------->",userId);
    $("#gameInfoBox").html(`<img src="./image/lose.png" alt="">`);
    console.log("looser--ddddddd---------------------------->",userId);
  
  }

  $(" #gameInfoBox").removeClass("d-none");
  $(" #gameInfoBox").removeClass("hide");
  



  setTimeout(() => {
    $("#gameInfoBox").removeClass("win-box");
    $("#gameInfoBox").removeClass("lose-box");
    $("#gameInfoBox").html(`  <form action="">
    <div class="card" style="width: 400px;  background-color: rgb(19, 246, 212); ">
        <div class="card-body ">
            <h1 style="text-align: center; color: blueviolet;">welcome to play checker Online </h1>
            <div class="form-floating mt-5 mb-5">
                <input type="text" class="form-control"   required id="userName"
                    placeholder="name@example.com" >
                    
                <label for="userName">Enter Player Name </label>
            </div>
           <div class="text-center">
                <input class="button-63 " type="submit" value="Play">
              </div>
            
        </div>s
    </div>
</form>`);
submitEvent();
$('#playerName').html('-');
$('#playerName').removeClass('playerActive');
$('#animeName').removeClass('playerActive');
$("#animeName").html('-');
$("#animeScore").html(`<img src="./image/red_king.png" alt=""><p>0</p>`)
$("#playerScore").html(`<img src="./image/red_king.png" alt=""><p>0</p>`)
}, 10000);
}



8705568176
function gameStart(data) {

  socket.emit('SIGNUP', { userName, isBot: false })

  $(" #gameInfoBox").html('<div class="timeSecond">Good Luck</div>');
console.log("===========>>>>>>>");
  setTimeout(() => {
    $(" #gameInfoBox").addClass("hide");
    if(color==1){
      $("#board").addClass('rotate');
    }
  }, 2000);
  console.log("===========>>>>>>>abxss")
  setTimeout(() => {
    $(" #gameInfoBox").addClass("d-none");
  }, 2500);
  console.log("=======")
}
function liveFun(){
  let liveData={
    eventName:'LEAVE',
    data:{
      userId
    }
  }
  sendToSocket(socket,liveData);
  window.sessionStorage.clear();
  location.reload()
}
socket.onAny((eventName, data) => {
  console.log(`RESPONSE EVENT : ${eventName} : DATA : ${JSON.stringify(data)}`);
  switch (eventName) {
    case "SIGN_UP":
      sinUp(data.data);
      break;
    case "JOIN_GAME":
      joinGame(data.data);
      break;
    case "CHECK_POSSIBILITY":
      checkPossibility(data.data);
      console.log('checkpossibility  event called..');
      break;
    case "START_GAME":
      console.log('start event called..');
      gameStart(data.data);
      break;
    case "MOVE":
      move(data.data);
      break;
    case "ROUND_TIMER_START":
      roundTimer(data.data);
      break;
    case "USER_TURN_START":
      console.log('userstarted event called..');
      userTurnStart(data.data);
      break;
    case "WIN":
      winGame(data.data);
      break;
  }
});

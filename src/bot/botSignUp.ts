import { signUp } from "../signUp/index";
// import { SignUpInterface } from "../interface/otherInterface";

async function botSignUp() {
  try {
    console.log("bot sign up called ..");

    let botData = {
      eventName: "SIGN_UP", data: {
        userName: "Bot",
        isBot: true,
      }
   }
    console.log("botdata======>.",botData);

    let fakeSocket = {
      id: "fakeSocketId"
    }
    await signUp(botData, fakeSocket)
  } catch (error) {
    console.log('botSignUp ERROR :: >>', error);
  }
}

export { botSignUp }

const haveEvents = "GamepadEvent" in window
const RAF = window.requestAnimationFrame

const gamepadID = "Xbox 360 Controller (XInput STANDARD GAMEPAD)"
let controller: Gamepad | undefined = undefined

type Button = [id: string | Array<string>, pressed: boolean]
let buttonsMap: Array<Button | null> = [
  ["_1K", false],
  ["_2K", false],
  ["_1P", false],
  ["_2P", false],
  ["_4P", false],
  ["_3P", false],
  ["_4K", false],
  ["_3K", false],
  null,
  null,
  null,
  null,
  [["Left-Thumb", "Right-Thumb"], false],
  ["Down", false],
  ["Left", false],
  ["Right", false],
]

function connectHandler(e: GamepadEvent) {
  addGamepad(e.gamepad)
}

function disconnectHandler(e: GamepadEvent) {
  removeGamepad(e.gamepad)
}

function addGamepad(gamepad: Gamepad) {
  console.log("addGamepad", gamepad)

  if (gamepad.id != gamepadID) {
    return
  }

  controller = gamepad
  RAF(scanButtons)
}

function removeGamepad(gamepad: Gamepad) {
  console.log("removeGamepad", gamepad)
  controller = undefined
}

function scanButtons() {
  scanGamepads()

  if (!controller || buttonsMap.length > controller.buttons.length) {
    return
  }

  for (let i = 0; i < controller.buttons.length; i++) {
    if (i <= buttonsMap.length - 1) {
      displayButtonState(i, controller.buttons[i].pressed)
    }
  }

  RAF(scanButtons)
}

function scanGamepads() {
  let gamepads = navigator.getGamepads() ?? []

  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]?.id === gamepadID) {
      controller = gamepads[i] ?? undefined
    }
  }
}

function displayButtonState(index: number, state: boolean) {
  const button = buttonsMap[index]

  if (button === null) {
    return
  }

  setPressedState(button, state)
}

function setPressedState(button: Button, state: boolean) {
  const buttonPrevState = button[1]
  const ids = Array.isArray(button[0]) ? button[0] : [button[0]]

  for (let id of ids) {
    let be = document.getElementById(id)

    if (buttonPrevState !== state) {
      button[1] = state

      if (state) {
        be?.classList.add("pressed")
      } else {
        be?.classList.remove("pressed")
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connectHandler)
  window.addEventListener("gamepaddisconnected", disconnectHandler)
} else {
  console.error("Browser Doesn't support GamepadEvent")
}

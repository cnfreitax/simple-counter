const BTN_RELOAD = 'btnReload'
const ID_COUNTER = 'counter'
const COUNTER_VALUE = 100
const PERIOD_INTERVAL = 10

class CounterComponent {

  constructor() {
    this.initialize()
  }

  praperConterProxy() {
    const handler = {
      set: (currenteContext, propertyKey, newValue) => {
        if(!currenteContext.value) {
          currenteContext.effectStop()
        }
        currenteContext[propertyKey] = newValue
        return true
      }
    }

    //Obj Proxy observa uma instancia e executa uma
    // função toda vez que ela é alterada
    const counter = new Proxy({
      value: COUNTER_VALUE,
      effectStop: () => {}
    }, handler)

    return counter
  }

  updateText = ({counterElement, counter}) => () =>  {
    const textIdentifier = '$$counter'
    const textDfeault = `Started on <strong>${textIdentifier}</strong> seconds...`

    counterElement.innerHTML = textDfeault.replace(textIdentifier, counter.value--)
  }

  scheduleCounterStop({counterElement, intervalId}) {
    
    return () => {
      clearInterval(intervalId)
      counterElement.innerHTML = ""
      this.disableButton(false)
    }
  }

  preparerButton(elementButton, inicialFn) {
    elementButton.addEventListener('click', inicialFn.bind(this))
    return (value =  true) => {
      const attr = 'disabled'
      if(value) {
        elementButton.setAttribute(attr, value)
        return;
      }

      elementButton.removeAttribute(attr)
    }
  }

  initialize() {
    console.log('wow')
    const counterElement = document.getElementById(ID_COUNTER)
    const counter = this.praperConterProxy()
    const countertArguments = {
      counterElement, 
      counter
    }

  const fn = this.updateText(countertArguments)
  const intervalId = setInterval(fn, PERIOD_INTERVAL)

  {
    const elementButton = document.getElementById(BTN_RELOAD)
    const disableButton = this.preparerButton(elementButton, this.initialize)
    disableButton()
    const countertArguments = {counterElement, intervalId}
    const stopCounterFn = this.scheduleCounterStop.apply({disableButton}, [countertArguments])
    counter.effectStop = stopCounterFn
  }

  } 
}



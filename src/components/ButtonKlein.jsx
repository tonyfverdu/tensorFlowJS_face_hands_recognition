/* eslint-disable react/prop-types */
import React from 'react'
import '../sass/componentSass/ButtonKlein.scss'

function ButtonKlein({ handleButton, text, parW, parH, parFS }) {
  function ManageButton() {
    handleButton()
  }
  return (
    <div className="containerButton">
      <button
        style={{ width: parW, height: parH, fontSize: parFS }}
        type={`${text === 'Delete' || text === 'Return' || text === 'Exit'
          ? 'reset'
          : text === 'Submit' || text === 'Login' || text === 'Query' ? 'submit' : 'button'}`}

        value={`${text === 'Delete' || text === 'Exit' || text === 'Return'
          ? text
          : text === 'Submit' || text === 'Login' || text === 'Query' ? text : text}` }
        className={`button ${text === 'Delete' || text === 'Exit' || text === 'Return' ? 'buttonReset' : ''}`.trimEnd()}
      onClick={() => ManageButton()}>
      {text}
    </button>
    </div >
  )
}

export default ButtonKlein
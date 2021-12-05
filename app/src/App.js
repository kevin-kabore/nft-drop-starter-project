import * as React from 'react'
import './App.css'
import twitterLogo from './assets/twitter-logo.svg'

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  const [walletAddress, setWalletAddress] = React.useState(null)

  /** checks if phantom exists on window and eagerly connects */
  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet detected')

          /** The solana object gives us a function that will allow us to connect directly with the user's wallet */
          const response = await solana.connect({onlyIfTrusted: true})
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString(),
          )
          /* set user's wallet address to state for reuse*/
          setWalletAddress(response.publicKey.toString())
        } else {
          alert(
            'Phantom Wallet not found, get a Phantom Wallet to use this app!',
          )
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    if (!window.solana) return

    try {
      const response = await window.solana.connect()
      console.log('connected with publicKey:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    } catch (error) {
      console.error(`error connecting ${error}`)
    }
  }
  /** To render when the user hasn't connected yet */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  const disconnectWallet = async () => {
    if (!walletAddress || !window.solana) return

    try {
      await window.solana.disconnect()
      setWalletAddress(null)
    } catch (error) {
      console.error(`error connecting ${error}`)
    }
  }

  const renderDisconnectWalletButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={disconnectWallet}
    >
      Disconnect from Wallet
    </button>
  )

  React.useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderDisconnectWalletButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App

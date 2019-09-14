import React from 'react'
import SocialLogin from 'react-social-login'
 
class ButtonSocial extends React.Component {
  render(){
    return(
      <button onClick={this.props.triggerLogin} {...this.props}>
        LOGIN WITH FACEBOOK
      </button>
    )
  }
}
 
export default SocialLogin(ButtonSocial)
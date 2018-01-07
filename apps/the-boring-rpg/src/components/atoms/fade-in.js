import React from 'react'

class FadeIn extends React.Component {
  state = {
    mounted: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ mounted: true })
    }, 0)
  }

  render() {
    const { className } = this.props.children.props
    return React.cloneElement(this.props.children, {
      className: className + (this.state.mounted ? ' fade-in' : '')
    })
  }
}

export {
	FadeIn,
}

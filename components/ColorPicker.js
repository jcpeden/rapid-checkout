import {
  Labelled,
  Card,
  TextField
} from '@shopify/polaris';
import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

export class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: "#ffffff",
    label: ''
  };

  static getDerivedStateFromProps(props, currentState) {
    if (currentState.color !== props.color || currentState.label !== props.label) {
      return {
        color: props.color,
        label: props.label
      }
    }
    return null
  }

  constructor (props) {
    super(props);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
    this.props.onChange(color.hex);
  };

  render() {
    const {label} = this.state;
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '25px',
          borderRadius: '2px',
          background: `${ this.state.color }`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }
      </div>
    )
  }
}

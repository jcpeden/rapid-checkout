import {
  Card,
  ChoiceList,
  RangeSlider,
  Select,
  TextField,
} from '@shopify/polaris';
import reactCSS from 'reactcss'
import { CompactPicker } from 'react-color';
import { ColorPicker } from './ColorPicker';
import Humanize from 'humanize-plus';

class Style extends React.Component {
  state = {
    style: {}
  }
  constructor(props) {
    super(props);
  }
  static getDerivedStateFromProps(props, currentState) {
    if (currentState.style !== props.style) {
      return {
        style: props.style
      }
    }
    return null
  }
  render() {
    let elements = '';
    if (this.state.style) {
      elements = Object.keys(this.state.style).map((key) => {
        if (this.state.style.hasOwnProperty(key)) {
          const value = this.state.style[key];
          const label = Humanize.titleCase(key.replace( /([A-Z])/g, " $1" ));
          if (key == 'backgroundColor' || key == 'fontColor' || key === 'color') {
            return (
                <TextField key={key} value={value} label={label}
                  connectedRight={
                    <ColorPicker label={label} key={key} onChange={(newValue) => this.handleChange(newValue, key) } color={value} />
                  }
                />
              );
          } else if (key == 'size' || key === 'fontSize' || key == 'width' || key == 'height' || key == 'buttonWidth' || key == 'buttonHeight' || key == 'borderWidth' || key == 'borderRadius') {
            return (
              <TextField type="number" key={key} value={value} label={label} onChange={(newValue) => this.handleChange(newValue, key)} />
            );
          } else if (key == 'fontFamily') {
            const options = [{label: 'Default', value: ''}, {label: 'Arial', value: 'Arial'}, {label: 'Verdana', value: 'Verdana'}];
            return (
               <Select key={key} options={options} label={label} onChange={(newValue) => this.handleChange(newValue, key)} value={value} />
            );
          } else if (key == 'fontStyle') {
            return (
              <ChoiceList key={key} allowMultiple="true" choices={[{label: 'Italic', value: 'italic'}]} selected={value} onChange={(newValue) => this.handleChange(newValue, key)} />
             );
          } else if (key == 'fontWeight') {
            return (
              <ChoiceList key={key} allowMultiple="true" choices={[{label: 'Bold', value: 'bold'}]} selected={value} onChange={(newValue) => this.handleChange(newValue, key)} />
             );
          } else if (key == 'textDecoration') {
            return (
              <ChoiceList key={key} allowMultiple="true" choices={[{label: 'Underline', value: 'underline'}]} selected={value} onChange={(newValue) => this.handleChange(newValue, key)} />
             );
          } else {
            return (
              <TextField key={key} value={value} label={label} onChange={(newValue) => this.handleChange(newValue, key)} />
            );
          }
        }
      });
    }
    const styles = reactCSS({
      'default': {
        card: {
          overflow: 'visible'
        }
      }
    });
    return (
      <Card title={this.props.heading} sectioned>
        {elements}
      </Card>
    );
  }
  handleChange(value, key) {
    const style = this.state.style;
    style[key] = value;
    this.setState({style});
    if (this.props.onChange) {
      this.props.onChange(this.state.style);
    }
  }
}

export default Style;

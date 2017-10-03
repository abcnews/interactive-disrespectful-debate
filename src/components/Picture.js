const { h, Component } = require('preact');

const styles = require('./Picture.scss');

class Picture extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    if (!this.wrapper) return;

    this.wrapper.appendChild(this.props.picture);
  }

  componentWillUnmount() {
    if (!this.wrapper) return;

    this.wrapper.removeChild(this.props.picture);
  }

  render() {
    return <div className={styles.wrapper} ref={el => (this.wrapper = el)} />;
  }
}

module.exports = Picture;

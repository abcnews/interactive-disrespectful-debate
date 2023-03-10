const { h, Component } = require('preact');

const Picture = require('./Picture');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const styles = require('./Panel.scss').default;

class Panel extends Component {
  componentDidMount() {
    if (!this.wrapper) return;

    this.props.panel.nodes.forEach(node => {
      this.wrapper.appendChild(node);
    });
  }

  componentWillUnmount() {
    if (!this.wrapper) return;

    this.props.panel.nodes.forEach(node => {
      this.wrapper.removeChild(node);
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { panel } = this.props;

    return (
      <div className={`${styles.wrapper} ${styles[panel.type]} ${this.props.className || ''}`}>
        <div className={styles.type}>
          <span>{panel.type.split('').join(' ')}</span>
        </div>
        <div className={styles.content}>
          {this.renderDate(panel.date)}
          <div ref={el => (this.wrapper = el)} className="u-richtext" />
          {this.renderLink(panel.link)}
        </div>
        {panel.picture && <Picture picture={panel.picture} />}
      </div>
    );
  }

  renderDate(date) {
    if (!date) return null;

    return (
      <div className={styles.date}>{MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()}</div>
    );
  }

  renderLink(link) {
    if (!link) return null;

    return (
      <div className={styles.link}>
        <a href={link}>{link}</a>
      </div>
    );
  }
}

module.exports = Panel;

const { h, Component } = require('preact');
const daysBetween = require('date-fns/difference_in_days');
const distanceInWords = require('date-fns/distance_in_words_to_now');

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
  'November',
  'December'
];
const styles = require('./Panel.scss');

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
          <span>{panel.type}</span>
        </div>
        {panel.imageUrl && <img src={panel.imageUrl} />}
        <div className={styles.content}>
          {this.renderDate(panel.date)}
          <div ref={el => (this.wrapper = el)} />
          {this.renderLink(panel.link)}
        </div>
      </div>
    );
  }

  renderDate(date) {
    if (!date) return null;

    let relativeDate = daysBetween(new Date(), date) > 14 ? '' : `, ${distanceInWords(date)} ago`;

    return (
      <div className={styles.date}>
        {date.getDate() + ' ' + MONTHS[date.getMonth()]}
        {relativeDate}
      </div>
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

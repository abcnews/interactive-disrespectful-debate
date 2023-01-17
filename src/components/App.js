const { h, Component } = require('preact');
const styles = require('./App.scss').default;

const Columns = require('./Columns');
const Panel = require('./Panel');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'asc'
    };
  }

  render() {
    const { panels } = this.props;

    let sortedPanels = panels.sort((a, b) => {
      if (a.date - b.date === 0) {
        return a.idx - b.idx;
      }

      if (this.state.sortBy === 'desc') {
        return a.date - b.date;
      } else {
        return b.date - a.date;
      }
    });

    return (
      <div className="">
        <div className={styles.root}>
          <Columns columnCount={1}>
            {sortedPanels.map((panel, index) => <Panel key={index} type={panel.type} panel={panel} />)}
          </Columns>
        </div>
      </div>
    );
  }
}

module.exports = App;

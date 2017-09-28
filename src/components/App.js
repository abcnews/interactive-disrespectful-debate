const { h, Component } = require('preact');
const styles = require('./App.scss');

const Columns = require('./Columns');
const Panel = require('./Panel');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortBy: 'asc',
            grouped: true
        };
    }

    render() {
        const { panels } = this.props;

        let sortedPanels = panels.sort((a, b) => {
            if (this.state.grouped) {
                if (a.type == 'yes' && b.type === 'no') {
                    return 1;
                } else if (a.type === 'no' && b.type === 'yes') {
                    return -1;
                }
            }

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
            <div className="u-full">
                <div className={styles.root}>
                    <div className={styles.toolbar}>
                        <button
                            onClick={e => this.setState({ grouped: true })}
                            className={this.state.grouped === true ? styles.activeButton : ''}>
                            Grouped
                        </button>
                        <button
                            onClick={e => this.setState({ grouped: false })}
                            className={this.state.grouped === false ? styles.activeButton : ''}>
                            Ungrouped
                        </button>

                        <div className={styles.flexibleSpace} />

                        <button
                            onClick={e => this.setState({ sortBy: 'asc' })}
                            className={this.state.sortBy === 'asc' ? styles.activeButton : ''}>
                            Newest
                        </button>
                        <button
                            onClick={e => this.setState({ sortBy: 'desc' })}
                            className={this.state.sortBy === 'desc' ? styles.activeButton : ''}>
                            Oldest
                        </button>
                    </div>

                    <Columns columnCount={this.state.grouped ? 2 : 1}>
                        {sortedPanels.map((panel, index) => <Panel key={index} type={panel.type} panel={panel} />)}
                    </Columns>
                </div>
            </div>
        );
    }
}

module.exports = App;

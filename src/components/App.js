const { h, Component } = require('preact');
const styles = require('./App.scss');

const Columns = require('./Columns');
const Panel = require('./Panel');

class App extends Component {
    render() {
        const { panels } = this.props;

        let sortedPanels = panels.sort((a, b) => {
            if (false) {
                return a.date - b.date;
            } else {
                return b.date - a.date;
            }
        });

        return (
            <div className="u-full">
                <div className={styles.root}>
                    <Columns>
                        <div type="yes" heading={true} className={`${styles.yesHeading}`}>
                            Yes
                        </div>
                        <div type="no" heading={true} className={`${styles.noHeading}`}>
                            No
                        </div>
                        {sortedPanels.map((panel, index) => <Panel key={index} type={panel.type} panel={panel} />)}
                    </Columns>
                </div>
            </div>
        );
    }
}

module.exports = App;

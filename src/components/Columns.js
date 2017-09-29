const { h, Component } = require('preact');

const styles = require('./Columns.scss');

class Columns extends Component {
    constructor(props) {
        super(props);

        this.setColumns = this.setColumns.bind(this);
        this.onResize = this.onResize.bind(this);
        this.columns = this.columns.bind(this);

        this.state = {
            columns: 1
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.columnCount !== this.props.columnCount) {
            this.setColumns(nextProps.columnCount);
        }
    }

    setColumns(columnCount) {
        const canDoMultipleColumns = window.innerWidth > 450;
        const columns = columnCount == 2 && canDoMultipleColumns ? 2 : 1;

        if (columns !== this.state.columns) {
            this.setState(state => ({ columns }));
        }
    }

    onResize() {
        this.setColumns(this.props.columnCount);
    }

    /**
   * Sort the panels into columns (if the width allows)
   * @return {array}
   */
    columns() {
        // Make an empty column for each column we have (max 2, really)
        let columns = [];
        for (let i = 0; i < this.state.columns; i++) {
            columns.push([]);
        }

        return this.props.children.reduce((all, child) => {
            // Don't include the headings in a single file list
            if (all.length === 1 && child.attributes.heading) return all;

            if (all.length === 1 || child.attributes.type === 'yes') {
                all[0].push(child);
            } else {
                all[1].push(child);
            }
            return all;
        }, columns);
    }

    render() {
        return (
            <div className={`${styles.wrapper} ${styles.className || ''}`} style={this.props.style}>
                {this.columns().map((column, columnIndex) => {
                    return (
                        <div
                            className={styles.column}
                            style={{ width: `${100 / this.state.columns}%` }}
                            key={columnIndex}>
                            {column.map(child => {
                                return (
                                    <div className={styles.cell} key={child.attributes.panel.idx}>
                                        {child}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

module.exports = Columns;

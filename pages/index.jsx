
import React from 'react';
import '../styles/Home.css';
import { getFlightDetails } from "../redux/actions/flightActions";
import { connect } from "react-redux";
import Filters from "../components/Filters";
import DisplayFlight from '../components/DisplayFlight';
import { FILTER_YEARS, FILTER_LAUNCH, FILTER_LANDING } from '../common-const';
import { Spinner } from '../components/Spinner';
import axios from 'axios';

class Home extends React.Component {

    static async getInitialProps() {
        let userData;
        try {
            const response = await axios.get('https://api.spacexdata.com/v3/launches?limit=100')
            userData = response.data;
        } catch {
            console.log('error')
        }
        return {
            initData: userData
        }
    }
    constructor(props) {
        super(props);
        this.state = {
          filterSelected: null,
          firstRender: true
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (filterValue) => {
      let filterSelected = {
        year:filterValue["year"] ? filterValue["year"] === this.state.filterSelected?.year ? undefined  : filterValue["year"] : this.state.filterSelected?.year,
        landing:filterValue["landing"] !== undefined ? filterValue["landing"] === this.state.filterSelected?.landing ? undefined : filterValue["landing"] : this.state.filterSelected?.landing,
        launch:filterValue["launch"] !== undefined ? filterValue["launch"] === this.state.filterSelected?.launch ? undefined : filterValue["launch"] : this.state.filterSelected?.launch 
      }
      this.setState({
        filterSelected,
        firstRender: false
      }, () => {
        this.props.loadFlights(this.state.filterSelected);
      })
    }
    render() {
        const { loading, initData, flightData } = this.props;
        const { filterSelected, firstRender } = this.state;
        const flights = firstRender ? initData : flightData;
        return (
            <div style={{backgroundColor: '#f1f1f1'}}>
            <div>
              <div className="header_title">
                <h2>SpaceX Launch Program</h2>
              </div>
            </div>
            {loading && <Spinner /> }
              <div className="main_container">
                  <div className="sidebar sidebar_filter">
                    <Filters 
                        filterYears={FILTER_YEARS} 
                        filterLaunch={FILTER_LAUNCH}
                        filterLanding={FILTER_LANDING}
                        activeFilter={filterSelected}
                        handleChange={this.handleChange}
                        />
                  </div>
                  <div className="content">
                      {flights && flights?.length>0 && flights.map((flight, index) => (
                        <DisplayFlight key={index} flight={flight} />
                      ))}
                  </div>
              </div>
              <div>
                <div className="footer"><b>Developed by:</b> Jekil Hansora</div>
              </div>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    flightData: state.flightReducer.flights,
    loading: state.flightReducer.loading
});

const mapDispatchToProps = dispatch => ({
    loadFlights: (request) => {
      dispatch({type: "BEGIN_LOADING"})
      dispatch(getFlightDetails(request));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);

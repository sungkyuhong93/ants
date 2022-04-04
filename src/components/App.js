import React from 'react';
import CountUp from 'react-countup';

export default class AntRace extends React.Component {
  constructor() {
    super();
    this.state = {
      ants: {},
      predicting: false,
      calculated: false,
      message: 'Click Start'
    };
    this.predictOdds = this.predictOdds.bind(this);
    this.rematch = this.rematch.bind(this);
  }

  componentDidMount() {
    const ants = {"ants":[{"name":"Marie ‘Ant’oinette","length":12,"color":"BLACK","weight":2},{"name":"Flamin’ Pincers","length":11,"color":"RED","weight":2},{"name":"AuNT Sarathi","length":20,"color":"BLACK","weight":5},{"name":"The Unbeareable Lightness of Being","length":5,"color":"SILVER","weight":1},{"name":"‘The Duke’","length":17,"color":"RED","weight":3}]};
      ants.ants.forEach((ant, index) => {
        ants[index] = ant;
        ants[index].image = `ant${index}`;
        ants[index].antOdds = 0;
      });
    this.setState({ants});
  }

  predictOdds() {
    this.setState({
      predicting: true,
      message: 'In Progress'
    });

    let calculatedCount = 0;

    Object.keys(this.state.ants).forEach((ant, i) => {
    const callback = (antOdds) => {
      const newState = this.state
      newState.ants[ant].antOdds = antOdds;
      calculatedCount++;
      if (calculatedCount === Object.keys(this.state.ants).length) {
        newState.calculated = true;
        newState.message = "Complete";
      }
      this.setState(newState);
    };

    this.generateAntWinLikelihoodCalculator()(callback);
    });
  }

  // use as is
  generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random() * 7000;
    var antOdds = Math.random();
    return function(callback) {
      setTimeout(function() {
        callback(antOdds);
      }, delay);
    };
  }

  rematch() {
    const newState = this.state;
    const ants = newState.ants;
    Object.keys(ants).map((i)=>{ ants[i].antOdds = 0 });
    this.setState({
      predicting: false,
      calculated: false,
      ants: ants,
      message: 'Click Start'
    });
  }

  favorite() {
    let high = 0;
    let ant;
    Object.keys(this.state.ants).forEach((i) => {
      if (this.state.ants[i].antOdds > high) {
        high = this.state.ants[i].antOdds;
        ant = i;
      }
    });
    return ant;
  }

  // JSX which renders ants
  renderAnts() {
    let ants;
    let favorite = this.favorite();
    if (this.state.predicting) {
      ants = Object.keys(this.state.ants).map((i) => {

        let odds = this.state.ants[i].antOdds;
        let status = <div className="predicting">Predicting</div>;
        let move = {};

        if (odds !== 0) {
          status = <div className="ant-chances"></div>;
          move = this.moveAnt(odds, favorite, i);
        }

        return (
          <div key={i} className="ant-row flex justify-between align-center">
            <div style={move} className="ant-info">
              <p>{this.state.ants[i].name}</p>
              <p>Color: {this.state.ants[i].color}</p>
              <p>Length: {this.state.ants[i].length}</p>
              {status}
              <div className={this.state.ants[i].image}></div>
            </div>

            <CountUp className="odds" start={0} end={Math.round(odds * 100)} suffix="%" />
          </div>
        );
      });
    } else {
      ants = Object.keys(this.state.ants).map((i) => {
        return (
          <div key={i} className="ant-row flex justify-between">
            <div className="ant-info">
              <p>{this.state.ants[i].name}</p>
              <p>Color: {this.state.ants[i].color}</p>
              <p>Length: {this.state.ants[i].length}</p>
              <div className={this.state.ants[i].image}></div>
            </div>
          </div>
        );
      });
    }
    return ants;
  }

  // Animate Ant
  moveAnt(odds, ant, i) {
    let opacity = { opacity: .5 };
    let distance = `${odds * (65 - 0) + 0}vw`;

    if (i === ant) {
       opacity = { opacity: 1 };
    }

    const move = {
      transitionTimingFunction: "ease-in",
      transition: "1s",
      marginLeft: distance,
      opacity: .5
    };

    return move;
  }

  render() {
    let renderAnts = this.renderAnts();
    let button = '';

    if (!this.state.predicting) {
      button = <button className="btn" onClick={this.predictOdds}>Start Race</button>;
    } else {
      button = <button className="btn" onClick={this.rematch}>rematch</button>;
    }

    return(
      <div className="app">
        <div className="flex align-center justify-between btn-row">
          <div className="btn-wrap">
            { button }
          </div>
          <h3>Status: {this.state.message}</h3>  
        </div>
    
        <div className="ants-wrap">
          <div className="ants">
            { renderAnts }
          </div>
        </div>
      </div>
    );
  }
}

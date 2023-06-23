"use client";

import {
  getAwayMatchesFromTeam,
  getBetimate,
  getDBTeams,
  getHomeMatchesFromTeam,
  getMatchById,
  getMatchesFromTeam,
} from "../../fetch/getData";
import { getAwayGoals, getGoals, getHomeGoals } from "../calculation/getGoals";

import { Grid, Table } from "@mantine/core";
import { getAverageGoals } from "../calculation/getAverageGoals";
import { getResult } from "../calculation/getResult";
import { getPoints } from "../calculation/getTeamStrength";
import { getWinner } from "../calculation/getWinner";
import { appForebetHead } from "./tableHead";

// let matchesCopy = [];
// let oddsTab;

export function PredictPage(props) {
  const match = props.match;
  const home = props.home;
  const away = props.away;

  const { data: matchData } = getMatchById(match);
  const { data: homeTeamMatchesData } = getMatchesFromTeam(home);
  const { data: awayTeamMatchesData } = getMatchesFromTeam(away);
  const { data: teamHomeMatchesData } = getHomeMatchesFromTeam(home);
  const { data: teamAwayMatchesData } = getAwayMatchesFromTeam(away);
  const { data: teamData } = getDBTeams();
  const { data: betimateData } = getBetimate();

  function getNameFromId(id, teamData) {
    if (teamData) {
      const team = teamData.find((team) => team.id === id);
      return team ? team.name : null;
    }
    return null;
  }

  const HomeTeamPercent =
    homeTeamMatchesData &&
    teamHomeMatchesData &&
    home &&
    getPoints(
      homeTeamMatchesData.slice(0, 15),
      home,
      teamHomeMatchesData.slice(0, 5)
    );

  const AwayTeamPercent =
    awayTeamMatchesData &&
    teamAwayMatchesData &&
    away &&
    getPoints(
      awayTeamMatchesData.slice(0, 15),
      away,
      teamAwayMatchesData.slice(0, 5)
    );

  const Home1X2Percent =
    HomeTeamPercent &&
    AwayTeamPercent &&
    getWinner(HomeTeamPercent, AwayTeamPercent).home;
  const Draw1X2Percent =
    HomeTeamPercent &&
    AwayTeamPercent &&
    getWinner(HomeTeamPercent, AwayTeamPercent).draw;
  const Away1X2Percent =
    HomeTeamPercent &&
    AwayTeamPercent &&
    getWinner(HomeTeamPercent, AwayTeamPercent).away;

  const TeamHomeGoals =
    teamHomeMatchesData && getHomeGoals(teamHomeMatchesData.slice(0, 5));
  const TeamAwayGoals =
    teamAwayMatchesData && getAwayGoals(teamAwayMatchesData.slice(0, 5));

  const HomeTeamGoals =
    homeTeamMatchesData && getGoals(homeTeamMatchesData.slice(0, 15), home);

  const AwayTeamGoals =
    awayTeamMatchesData && getGoals(awayTeamMatchesData.slice(0, 15), away);

  const HomeTeamProbabilityGoals =
    TeamHomeGoals &&
    HomeTeamGoals &&
    getAverageGoals(
      HomeTeamGoals.home,
      HomeTeamGoals.away,
      TeamHomeGoals.home,
      TeamHomeGoals.away
    );

  const AwayTeamProbabilityGoals =
    TeamAwayGoals &&
    AwayTeamGoals &&
    getAverageGoals(
      AwayTeamGoals.home,
      AwayTeamGoals.away,
      TeamAwayGoals.home,
      TeamAwayGoals.away
    );

  const formResult =
    Home1X2Percent &&
    HomeTeamProbabilityGoals &&
    getResult(
      Home1X2Percent,
      Draw1X2Percent,
      Away1X2Percent,
      HomeTeamProbabilityGoals.score,
      AwayTeamProbabilityGoals.lost,
      AwayTeamProbabilityGoals.score,
      AwayTeamProbabilityGoals.lost
    );

  // const [homeTeamMatches, setHomeTeamMatches] = useState();
  // const [awayTeamMatches, setAwayTeamMatches] = useState();
  // const [forebetTab, setForebetTab] = useState();

  // const [homeName, setHomeName] = useState();
  // const [awayName, setAwayName] = useState();

  // const getMatches = () => {
  //     return new Promise ((resolve, reject) => {
  //     if(matchesCopy && matchesCopy.length < 1){
  //         FetchResults(home, away).then((value) => {
  //             matchesCopy = value;
  //             resolve()
  //           })
  //     }
  //     })
  // }

  // const matchesTab = new Array(0);

  // function initalizeData(){
  //     if(matchesTab[0] && !homeTeamMatches && !awayTeamMatches){
  //         setHomeTeamMatches(matchesTab[0][0].sort(sortByTime));
  //         setAwayTeamMatches(matchesTab[0][1].sort(sortByTime));
  //     }
  // }

  // let homeTeamStrength;
  // let awayTeamStrength;
  // let probabilityScoreGoalsByHomeTeam;
  // let probabilityLostGoalsByHomeTeam;
  // let probabilityScoreGoalsByAwayTeam;
  // let probabilityLostGoalsByAwayTeam;
  // let homePercent;
  // let drawPercent;
  // let awayPercent;
  // let allPercent;

  //   if (teamHomeMatchesData && teamAwayMatchesData) {
  //     homeTeamStrength = getTeamStrength(
  //       teamHomeMatchesData.slice(0, 15),
  //       home,
  //       true
  //     );
  //     awayTeamStrength = getTeamStrength(
  //       teamAwayMatchesData.slice(0, 15),
  //       away,
  //       false
  //     );
  //     probabilityScoreGoalsByHomeTeam = getAverageGoals(
  //       getGoals(teamHomeMatchesData.slice(0, 15), home, away).home,
  //       getGoals(homeTeamMatches.slice(0, 15), home, away).away,
  //       getHomeGoals(homeTeamMatches, home).home,
  //       getHomeGoals(homeTeamMatches, home).away
  //     ).score.toFixed(2);
  //     probabilityLostGoalsByHomeTeam = getAverageGoals(
  //       getGoals(teamHomeMatchesData.slice(0, 15), home, away).home,
  //       getGoals(homeTeamMatches.slice(0, 15), home, away).away,
  //       getHomeGoals(homeTeamMatches, home).home,
  //       getHomeGoals(homeTeamMatches, home).away
  //     ).lost.toFixed(2);
  //     probabilityScoreGoalsByAwayTeam = getAverageGoals(
  //       getGoals(teamAwayMatchesData.slice(0, 15), home, away).home,
  //       getGoals(awayTeamMatches.slice(0, 15), home, away).away,
  //       getAwayGoals(awayTeamMatches, away).away,
  //       getAwayGoals(awayTeamMatches, away).home
  //     ).score.toFixed(2);
  //     probabilityLostGoalsByAwayTeam = getAverageGoals(
  //       getGoals(teamAwayMatchesData.slice(0, 15), home, away).home,
  //       getGoals(awayTeamMatches.slice(0, 15), home, away).away,
  //       getAwayGoals(awayTeamMatches, away).away,
  //       getAwayGoals(awayTeamMatches, away).home
  //     ).lost.toFixed(2);
  //     homePercent = getWinner(homeTeamStrength, awayTeamStrength).home;
  //     drawPercent = getWinner(homeTeamStrength, awayTeamStrength).draw;
  //     awayPercent = getWinner(homeTeamStrength, awayTeamStrength).away;
  //     //   allPercent = (1/parseFloat(oddsTab.home))*100+(1/parseFloat(oddsTab.draw))*100+(1/parseFloat(oddsTab.away))*100
  //   }

  // useEffect(()=>{
  //     getMatches().then(() => {
  //         matchesTab.push(matchesCopy);
  //     }).then(initalizeData);

  //     new Promise ((resolve, reject) => {
  //         if(!oddsTab){
  //             FetchBet(match).then((value) => {
  //                 oddsTab = value;
  //                 resolve()
  //             })
  //         }
  //     })

  //     new Promise ((resolve, reject) => {
  //         if(!forebetTab){
  //             FetchForebet().then((value) => {
  //                 setForebetTab(value);
  //                 resolve()
  //             })
  //         }
  //     })
  // },[matchesTab, oddsTab, forebetTab])

  // const oddsRows = (
  //     oddsTab && homeTeamStrength && awayTeamStrength &&
  //     <tr>
  //         <td>{oddsTab.home}</td>
  //         <td>{oddsTab.draw}</td>
  //         <td>{oddsTab.away}</td>
  //     </tr>
  //   );

  //   const probabilityRows = (
  //     oddsTab && homeTeamStrength && awayTeamStrength &&
  //     <tr>
  //         <td>{(((1/(parseFloat(oddsTab.home)))*100/allPercent)*100).toFixed(2)}%</td>
  //         <td>{(((1/(parseFloat(oddsTab.draw)))*100/allPercent)*100).toFixed(2)}%</td>
  //         <td>{(((1/(parseFloat(oddsTab.away)))*100/allPercent)*100).toFixed(2)}%</td>
  //     </tr>
  //   );

  //   const profitableProbabilityRows = (
  //     oddsTab && homeTeamStrength && awayTeamStrength &&
  //     <tr>
  //         <td>{((1/(parseFloat(oddsTab.home)*88/100))*100).toFixed(2)}%</td>
  //         <td>{((1/(parseFloat(oddsTab.draw)*88/100))*100).toFixed(2)}%</td>
  //         <td>{((1/(parseFloat(oddsTab.away)*88/100))*100).toFixed(2)}%</td>
  //     </tr>
  //   );

  const appRows = matchData && formResult && (
    <>
      <tr className="font-medium">
        <td>Ostatnia forma</td>
        <td>
          {Home1X2Percent}% - {(100 / Home1X2Percent).toFixed(2)}
        </td>
        <td>
          {Draw1X2Percent}% - {(100 / Draw1X2Percent).toFixed(2)}
        </td>
        <td>
          {Away1X2Percent}% - {(100 / Away1X2Percent).toFixed(2)}
        </td>
        <td className={matchData.result === formResult ? "underline" : ""}>
          {formResult}
        </td>
      </tr>
      <tr className="font-medium">
        <td>Kursy bukmachera</td>
        <td>
          {((1 / matchData.home_odd) * 100).toFixed(2)}% - {matchData.home_odd}
        </td>
        <td>
          {((1 / matchData.draw_odd) * 100).toFixed(2)}% - {matchData.draw_odd}
        </td>
        <td>
          {((1 / matchData.away_odd) * 100).toFixed(2)}% - {matchData.away_odd}
        </td>
        <td
          className={
            matchData.result_odd === matchData.result ? "underline" : ""
          }
        >
          {matchData.result_odd}
        </td>
      </tr>
      {betimateData &&
        home &&
        teamData &&
        betimateData.map((match) => {
          if (
            match.homeName === getNameFromId(parseInt(home), teamData) &&
            match.awayName === getNameFromId(parseInt(away), teamData)
          ) {
            return (
              <tr className="font-medium">
                <td>Betimate.com</td>
                <td>
                  {match.predictHome}% -{" "}
                  {((1 / match.predictHome) * 100).toFixed(2)}
                </td>
                <td>
                  {match.predictDraw}% -{" "}
                  {((1 / match.predictDraw) * 100).toFixed(2)}
                </td>
                <td>
                  {match.predictAway}% -{" "}
                  {((1 / match.predictAway) * 100).toFixed(2)}
                </td>
                <td
                  className={
                    match.predictResult === matchData.result ? "underline" : ""
                  }
                >
                  {match.predictResult}
                </td>
              </tr>
            );
          }
        })}
    </>
  );

  return (
    <div className="container mx-auto container-bg px-8">
      <h2 className="text-3xl py-8 font-bold text-center">
        {teamData &&
          home &&
          `${getNameFromId(parseInt(home), teamData)} ${
            matchData.result
          } ${getNameFromId(parseInt(away), teamData)}`}
      </h2>
      <table></table>
      {/* <Table className="tbl three-columns marginbottom" horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
                <caption>Wartości jakie oferuje jeden z bukmacherów za każdą postawioną złotówke</caption>
                    <thead>{oddsHead}</thead>
                    <tbody>{oddsRows}</tbody>  
            </Table>
            <Table className="tbl three-columns marginbottom" horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
                <caption>Przełożenie powyższych kursów na szacowanie według bukmachera</caption>
                    <thead>{probabilityHead}</thead>
                    <tbody>{probabilityRows}</tbody>  
            </Table>
            <Table className="tbl three-columns marginbottom" horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
                <caption>Procent szacowania, jaki powinien być w rzeczywistości, aby klientowi opłacało się korzystać z usług bukmacherskich</caption>
                    <thead>{profitableProbabilityHead}</thead>
                    <tbody>{profitableProbabilityRows}</tbody> 
            </Table>
            <Table className="tbl four-columns marginbottom" horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
                <caption>Sugerowany wynik meczu przez portal forebet.com</caption>
                    <thead>{appForebetHead}</thead>
                    <tbody>
                    {
                        forebetTab && homeName && awayName && Object.entries(forebetTab).map(bet =>{
                            if(bet[1].homeName === homeName && bet[1].awayName === awayName){
                                return(
                                    <tr>
                                        <td>{bet[1].homePercent}</td>
                                        <td>{bet[1].drawPercent}</td>
                                        <td>{bet[1].awayPercent}</td>
                                        <td>{bet[1].result}</td>
                                    </tr>)
                            }

                        })
                    }
                    </tbody>  
            </Table> */}
      <Table
        className="text-center bg-white"
        horizontalSpacing="xl"
        verticalSpacing="xs"
        striped
        highlightOnHover
        withBorder
        withColumnBorders
      >
        <caption>Szacowany wynik meczu, według systemu liczącego forme</caption>
        <thead className=" bg-[#A6F490] border-black border-1">
          {appForebetHead}
        </thead>
        <tbody>{appRows}</tbody>
      </Table>
      <div>
        <Grid className>
          <Grid.Col span={12}>
            <h2 className="text-2xl mb-3 font-bold">
              Gospodarze: {getNameFromId(home)}
            </h2>
            <p>Siła drużyny: {HomeTeamPercent}</p>
            <p>
              Przewidywane bramki niezależne od przeciwnika:{" "}
              {HomeTeamProbabilityGoals &&
                HomeTeamProbabilityGoals.score.toFixed(2)}{" "}
              -{" "}
              {HomeTeamProbabilityGoals &&
                HomeTeamProbabilityGoals.lost.toFixed(2)}
            </p>
          </Grid.Col>
        </Grid>

        <Grid className="last-results right-last-results">
          <Grid.Col span={12} className="last-results-box">
            <h2 className="text-2xl mb-3 font-bold">
              Goście {getNameFromId(away)}
            </h2>
            <p>Siła drużyny: {AwayTeamPercent}</p>
            <p>
              Przewidywane bramki niezależne od przeciwnika:{" "}
              {AwayTeamProbabilityGoals &&
                AwayTeamProbabilityGoals.score.toFixed(2)}{" "}
              -{" "}
              {AwayTeamProbabilityGoals &&
                AwayTeamProbabilityGoals.lost.toFixed(2)}
            </p>
            {/* <p>
              W ostatnich 15 meczach zdobyli{" "}
              {awayTeamMatches &&
                getPoints(awayTeamMatches.slice(0, 15), home, away)}{" "}
              punktów, średnia{" "}
              {awayTeamMatches &&
                (
                  getPoints(awayTeamMatches.slice(0, 15), home, away) / 15
                ).toFixed(2)}{" "}
              pkt na mecz, bilans bramkowy:{" "}
              {awayTeamMatches &&
                getGoals(awayTeamMatches.slice(0, 15), home, away).home +
                  ":" +
                  getGoals(awayTeamMatches.slice(0, 15), home, away).away}
            </p>
            <p>
              W ostatnich 5 meczach na wyjeździe zdobyli{" "}
              {awayTeamMatches && getAwayPoints(awayTeamMatches, away)} punktów,
              średnia{" "}
              {awayTeamMatches &&
                (getAwayPoints(awayTeamMatches, away) / 5).toFixed(2)}{" "}
              pkt na mecz, bilans bramkowy{" "}
              {awayTeamMatches &&
                getAwayGoals(awayTeamMatches, away).away +
                  ":" +
                  getAwayGoals(awayTeamMatches, away).home}
            </p>
            <p>
              Siła tej drużyny na podstawie formy i gry na wyjeździe:{" "}
              {awayTeamMatches &&
                getTeamStrength(awayTeamMatches.slice(0, 15), away, false)}
            </p>
            <p>
              Szacowane bramki na wyjeździe:{" "}
              {awayTeamMatches &&
                probabilityScoreGoalsByAwayTeam +
                  ":" +
                  probabilityLostGoalsByAwayTeam}
            </p> */}
          </Grid.Col>
          {/* {awayTeamMatches &&
            awayTeamMatches.slice(0, 15).map((match) => {
              if (!awayName && match.AWAY_PARTICIPANT_IDS[0] === away)
                setAwayName(dictClubs(match.AWAY_NAME));
              return (
                <Grid.Col span={12} className="last-results-box">
                  <img
                    className="clubLogo"
                    src={match.HOME_IMAGES[0]}
                    alt="Team Home"
                  />
                  <img
                    className="clubLogo"
                    src={match.AWAY_IMAGES[0]}
                    alt="Team Away"
                  />
                  <a>
                    {dictClubs(match.HOME_NAME)} {match.HOME_SCORE_CURRENT}-
                    {match.AWAY_SCORE_CURRENT} ({match.HOME_SCORE_PART_1}-
                    {match.AWAY_SCORE_PART_1}) {dictClubs(match.AWAY_NAME)}
                  </a>
                  <br />
                  <p>{match.ROUND}</p>
                  <p>{convertToDate(match.START_TIME)}</p>
                </Grid.Col>
              );
            })} */}
        </Grid>
      </div>
    </div>
  );
}

export default PredictPage;

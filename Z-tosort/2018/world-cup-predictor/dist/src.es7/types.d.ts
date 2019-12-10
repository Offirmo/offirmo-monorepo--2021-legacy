import { Enum } from 'typescript-string-enums';
declare const RoundType: {
    Group: "Group";
    "Round of 16": "Round of 16";
    "Quarter-final": "Quarter-final";
    "Semi-final": "Semi-final";
    "Third place play-off": "Third place play-off";
    Final: "Final";
};
declare type RoundType = Enum<typeof RoundType>;
declare const Team: {
    Argentina: "Argentina";
    Australia: "Australia";
    Belgium: "Belgium";
    Brazil: "Brazil";
    Colombia: "Colombia";
    "Costa Rica": "Costa Rica";
    Croatia: "Croatia";
    Denmark: "Denmark";
    Egypt: "Egypt";
    England: "England";
    France: "France";
    Germany: "Germany";
    Iceland: "Iceland";
    Iran: "Iran";
    Japan: "Japan";
    Mexico: "Mexico";
    Morocco: "Morocco";
    Nigeria: "Nigeria";
    Panama: "Panama";
    Peru: "Peru";
    Poland: "Poland";
    Portugal: "Portugal";
    Russia: "Russia";
    "Saudi Arabia": "Saudi Arabia";
    Senegal: "Senegal";
    Serbia: "Serbia";
    "South Korea": "South Korea";
    Spain: "Spain";
    Sweden: "Sweden";
    Switzerland: "Switzerland";
    Tunisia: "Tunisia";
    Uruguay: "Uruguay";
};
declare type Team = Enum<typeof Team>;
interface MatchResult {
    match: number;
    round: RoundType;
    team1: {
        name: Team;
        score: number;
        winner: boolean;
    };
    team2: {
        name: Team;
        score: number;
        winner: boolean;
    };
}
interface PredictionRequest {
    round: RoundType;
    match: number;
    team1: Team;
    team2: Team;
    results: MatchResult[];
}
interface PredictionResult {
    winner: Team | 'draw';
}
declare type Predictor = (request: PredictionRequest) => PredictionResult;
export { RoundType, Team, MatchResult, PredictionRequest, PredictionResult, Predictor, };

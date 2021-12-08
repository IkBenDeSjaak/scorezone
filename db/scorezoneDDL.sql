DROP DATABASE ScoreZoneTestDB;

CREATE DATABASE ScoreZoneTestDB;

USE ScoreZoneTestDB;

CREATE TABLE Roles (
	RoleName			VARCHAR(20)			NOT NULL,

	CONSTRAINT PK_Roles PRIMARY KEY (RoleName)
);

CREATE TABLE Users (
	UserId				INT					NOT NULL	AUTO_INCREMENT, 
	Email				VARCHAR(64)			NOT NULL	UNIQUE,
	Username			VARCHAR(20)			NOT NULL	UNIQUE,
	Password			CHAR(60)			NOT NULL,
	FirstName			VARCHAR(50)			NULL,		
	LastName			VARCHAR(50)			NULL,
	JoinDate			DATETIME			NOT NULL	DEFAULT		CURRENT_TIMESTAMP,
	Role				VARCHAR(20)			NOT NULL,
	HidePredictions		BOOLEAN				NOT NULL,	

	CONSTRAINT PK_Users PRIMARY KEY (UserId),
	CONSTRAINT FK_Users_Role FOREIGN KEY (Role) REFERENCES Roles(RoleName)
);

CREATE TABLE Countries (
	CountryId			INT					NOT NULL	AUTO_INCREMENT,
	CountryName			VARCHAR(60)			NOT NULL	UNIQUE,

	CONSTRAINT PK_Countries PRIMARY KEY (CountryId)
);

CREATE TABLE Seasons (
	SeasonId			INT					NOT NULL	AUTO_INCREMENT,
	SeasonName			VARCHAR(10)			NOT NULL,
	StartDate			DATE				NOT NULL,
	EndDate				DATE				NOT NULL,
	
	CONSTRAINT PK_Seasons PRIMARY KEY (SeasonId)
);

CREATE TABLE Associations (
	AssociationId		INT					NOT NULL	AUTO_INCREMENT, 
	AssociationName		CHAR(8)				NOT NULL	UNIQUE,
	CountryId			INT					NOT NULL,

	CONSTRAINT PK_Associations PRIMARY KEY (AssociationId),
	CONSTRAINT FK_Associations_Country FOREIGN KEY (CountryId) REFERENCES Countries(CountryId)
);

CREATE TABLE Leagues (
	LeagueId			INT					NOT NULL	AUTO_INCREMENT, 
	LeagueName			VARCHAR(40)			NOT NULL,
	AssociationId		INT					NOT NULL,
	LeagueImage			VARCHAR(100)		NULL,

	CONSTRAINT PK_Leagues PRIMARY KEY (LeagueId),
	CONSTRAINT FK_Leagues_Association FOREIGN KEY (AssociationId) REFERENCES Associations(AssociationId)
);

CREATE TABLE LeagueSeasons (
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,

	CONSTRAINT PK_LeagueSeasons PRIMARY KEY (LeagueId, SeasonId),
	CONSTRAINT FK_LeagueSeasons_League FOREIGN KEY (LeagueId) REFERENCES Leagues(LeagueId),
	CONSTRAINT FK_LeagueSeasons_Season FOREIGN KEY (SeasonId) REFERENCES Seasons(SeasonId)
);

CREATE TABLE UserLeagues (
	UserId				INT					NOT NULL,
	LeagueId			INT					NOT NULL,

	CONSTRAINT PK_UserLeagues PRIMARY KEY (UserId, LeagueId),
	CONSTRAINT FK_UserLeagues_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
	CONSTRAINT FK_UserLeagues_League FOREIGN KEY (LeagueId) REFERENCES Leagues(LeagueId)
);

CREATE TABLE Teams (
	TeamId				INT					NOT NULL	AUTO_INCREMENT,
	TeamName			VARCHAR(30)			NOT NULL,
	TeamImage			VARCHAR(100)		NULL,

	CONSTRAINT PK_Teams PRIMARY KEY (TeamId)
);

CREATE TABLE TeamsInLeagues (
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	TeamId				INT					NOT NULL,

	CONSTRAINT PK_TeamsInLeagues PRIMARY KEY (LeagueId, SeasonId, TeamId),
	CONSTRAINT FK_TeamsInLeagues_League FOREIGN KEY (LeagueId) REFERENCES Leagues(LeagueId),
	CONSTRAINT FK_TeamsInLeagues_Season FOREIGN KEY (SeasonId) REFERENCES Seasons(SeasonId),
	CONSTRAINT FK_TeamsInLeagues_Team FOREIGN KEY (TeamId) REFERENCES Teams(TeamId)
);

CREATE TABLE Matches (
	MatchId				INT					NOT NULL	AUTO_INCREMENT,
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	HomeTeam			INT					NOT NULL,
	AwayTeam			INT					NOT NULL,
	MatchDay			INT					NOT NULL,
	StartTime			DATETIME			NOT NULL,

	CONSTRAINT PK_Matches PRIMARY KEY (MatchId),
	CONSTRAINT FK_Matches_League FOREIGN KEY (LeagueId) REFERENCES Leagues(LeagueId),
	CONSTRAINT FK_Matches_Season FOREIGN KEY (SeasonId) REFERENCES Seasons(SeasonId),
	CONSTRAINT FK_Matches_HomeTeam FOREIGN KEY (HomeTeam) REFERENCES Teams(TeamId),
	CONSTRAINT FK_Matches_AwayTeam FOREIGN KEY (AwayTeam) REFERENCES Teams(TeamId)
);

CREATE TABLE MatchPredictions (
	UserId				INT					NOT NULL,
	MatchId				INT					NOT NULL,
	GoalsHomeTeam		TINYINT				NOT NULL,
	GoalsAwayTeam		TINYINT				NOT NULL,
	SubmitTime			DATETIME			NOT NULL	DEFAULT		CURRENT_TIMESTAMP,

	CONSTRAINT PK_MatchPredictions PRIMARY KEY (UserId, MatchId),
	CONSTRAINT FK_MatchPredictions_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
	CONSTRAINT FK_MatchPredictions_Match FOREIGN KEY (MatchId) REFERENCES Matches(MatchId)
);

CREATE TABLE MatchResults (
	MatchId				INT					NOT NULL,
	GoalsHomeTeam		TINYINT				NOT NULL,
	GoalsAwayTeam		TINYINT				NOT NULL,

	CONSTRAINT PK_MatchResults PRIMARY KEY (MatchId),
	CONSTRAINT FK_MatchResults_Match FOREIGN KEY (MatchId) REFERENCES Matches(MatchId)
);

CREATE TABLE Groups (
	GroupId				INT					NOT NULL	AUTO_INCREMENT,
	GroupName			CHAR(1)				NOT NULL,

	CONSTRAINT PK_Groups PRIMARY KEY (GroupId)
);

CREATE TABLE TeamsInGroupsInLeagues (
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	GroupId				INT					NOT NULL,
	TeamId				INT					NOT NULL,

	CONSTRAINT PK_TeamsInGroupsInLeagues PRIMARY KEY (LeagueId, SeasonId, GroupId, TeamId),
	CONSTRAINT FK_TeamsInGroupsInLeagues_TeamInLeague FOREIGN KEY (LeagueId, SeasonId, TeamId) REFERENCES TeamsInLeagues(LeagueId, SeasonId, TeamId),
	CONSTRAINT FK_TeamsInGroupsInLeagues_Group FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);

CREATE TABLE PointsStrategies (
	StrategyId			INT					NOT NULL	AUTO_INCREMENT, 
	CreationTime		DATETIME			NOT NULL	DEFAULT		CURRENT_TIMESTAMP,
	Creator				INT					NOT NULL,

	CONSTRAINT PK_PointsStrategies PRIMARY KEY (StrategyId),
	CONSTRAINT FK_PointsStrategies_User FOREIGN KEY (Creator) REFERENCES Users(UserId) 
);

CREATE TABLE PointsOptions (
	OptionId			INT					NOT NULL	AUTO_INCREMENT,
	OptionName			VARCHAR(30)			NOT NULL,

	CONSTRAINT PK_PointsOptions PRIMARY KEY	(OptionId)
);

CREATE TABLE PointsStrategiesOptionPoints (
	StrategyId			INT					NOT NULL,
	OptionId			INT					NOT NULL,
	Points				TINYINT				NOT NULL,

	CONSTRAINT PK_PointsStrategiesOptionPoints PRIMARY KEY (StrategyId, OptionId),
	CONSTRAINT FK_PointsStrategiesOptionPoints_Strategy FOREIGN KEY (StrategyId) REFERENCES PointsStrategies(StrategyId),
	CONSTRAINT FK_PointsStrategiesOptionPoints_Option FOREIGN KEY (OptionId) REFERENCES PointsOptions(OptionId)
);

CREATE TABLE Poules (
	PouleId				INT					NOT NULL	AUTO_INCREMENT,
	PouleName			VARCHAR(25)			NOT NULL,
	PouleLeague			INT					NOT NULL,
	PouleSeason			INT					NOT NULL,
	Creator				INT					NOT NULL,
	CreationTime		DATETIME			NOT NULL	DEFAULT		CURRENT_TIMESTAMP,
	PointsStrategy		INT					NOT NULL,
	JoinCode			VARCHAR(36)			NOT NULL	UNIQUE 		DEFAULT		UUID(), 
	ApproveParticipants	BOOLEAN				NOT NULL, 

	CONSTRAINT PK_Poules PRIMARY KEY (PouleId),
	CONSTRAINT FK_Poules_League FOREIGN KEY (PouleLeague) REFERENCES Leagues(LeagueId),
	CONSTRAINT FK_Poules_Season FOREIGN KEY (PouleSeason) REFERENCES Seasons(SeasonId),
	CONSTRAINT FK_Poules_Creator FOREIGN KEY (Creator) REFERENCES Users(UserId),
	CONSTRAINT FK_Poules_PointsStrategy FOREIGN KEY (PointsStrategy) REFERENCES PointsStrategies(StrategyId)
);

CREATE TABLE PouleParticipants (
	PouleId				INT					NOT NULL,
	UserId				INT					NOT NULL,
	Approved			BOOLEAN				NOT NULL,
	JoinTime			DATETIME			NOT NULL	DEFAULT		CURRENT_TIMESTAMP,

	CONSTRAINT PK_PouleParticipants PRIMARY KEY (PouleId, UserId),
	CONSTRAINT FK_PouleParticipants_Poule FOREIGN KEY (PouleId) REFERENCES Poules(PouleId),
	CONSTRAINT FK_PouleParticipants_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE LeagueStandings (
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	TeamId				INT					NOT NULL,
	Position			TINYINT				NOT NULL,

	CONSTRAINT PK_LeagueStandings PRIMARY KEY (LeagueId, SeasonId, TeamId),
	CONSTRAINT FK_LeagueStandings_TeamInLeague FOREIGN KEY (LeagueId, SeasonId, TeamId) REFERENCES TeamsInLeagues(LeagueId, SeasonId, TeamId)
);

CREATE TABLE LeagueStandingsPredictions (
	UserId				INT					NOT NULL,
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	TeamId				INT					NOT NULL,
	Position			TINYINT				NOT NULL,

	CONSTRAINT PK_LeagueStandingsPredictions PRIMARY KEY (UserId, LeagueId, SeasonId, TeamId),
	CONSTRAINT FK_LeagueStandingsPredictions_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
	CONSTRAINT FK_LeagueStandingsPredictions_TeamInLeague FOREIGN KEY (LeagueId, SeasonId, TeamId) REFERENCES TeamsInLeagues(LeagueId, SeasonId, TeamId)
);

CREATE TABLE GroupStandings (
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	GroupId				INT					NOT NULL,
	TeamId				INT					NOT NULL,
	Position			TINYINT				NOT NULL,

	CONSTRAINT PK_GroupStandings PRIMARY KEY (LeagueId, SeasonId, GroupId, TeamId),
	CONSTRAINT FK_GroupStandings_TeamInGroupInLeague FOREIGN KEY (LeagueId, SeasonId, GroupId, TeamId) REFERENCES TeamsInGroupsInLeagues(LeagueId, SeasonId, GroupId, TeamId)
);

CREATE TABLE GroupStandingsPredictions (
	UserId				INT					NOT NULL,
	LeagueId			INT					NOT NULL,
	SeasonId			INT					NOT NULL,
	GroupId				INT					NOT NULL,
	TeamId				INT					NOT NULL,
	Position			TINYINT				NOT NULL,

	CONSTRAINT PK_GroupStandingsPredictions PRIMARY KEY (UserId, LeagueId, SeasonId, GroupId, TeamId),
	CONSTRAINT FK_GroupStandingsPredictions_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
	CONSTRAINT FK_GroupStandingsPredictions_TeamInGroupInLeague FOREIGN KEY (LeagueId, SeasonId, GroupId, TeamId) REFERENCES TeamsInGroupsInLeagues(LeagueId, SeasonId, GroupId, TeamId)
);
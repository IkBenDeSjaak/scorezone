DELETE FROM GroupStandingsPredictions;
DELETE FROM GroupStandings;
DELETE FROM LeagueStandingsPredictions;
DELETE FROM LeagueStandings;
DELETE FROM PouleParticipants;
DELETE FROM Poules;
DELETE FROM PointsStrategiesOptionPoints;
DELETE FROM PointsOptions;
DELETE FROM PointsStrategies;
DELETE FROM TeamsInGroupsInLeagues;
DELETE FROM Groups;
DELETE FROM MatchResults;
DELETE FROM MatchPredictions;
DELETE FROM Matches;
DELETE FROM TeamsInLeagues;
DELETE FROM Teams;
DELETE FROM UserLeagues;
DELETE FROM LeagueSeasons;
DELETE FROM Leagues;
DELETE FROM Associations;
DELETE FROM Seasons;
DELETE FROM Countries;
DELETE FROM Users;
DELETE FROM Roles;

INSERT INTO Roles (RoleName) VALUES 
('Admin'), 
('User');

INSERT INTO Users (Email, Username, Password, FirstName, LastName, Role, HidePredictions) VALUES
('test@email.com', 'sjaak123', '$2a$12$dHc1UpCs8D8ogZEEbTtAI.n7MVkr5EIU0je0rFkRZxKHjNJ6Mra1S', 'Sjaak', 'Kok', 'Admin', 1),
('test123@email.com', 'bertje3', '$2a$12$pNmAppB02W2hpcuxXU5eae0ShpN5J4r6TYF5DykqeHOvlyLtenjVS', 'Bert', 'de Knaap', 'User', 1),
('test12332423@email.com', 'bertje33333', '$2a$12$pNmAppB02W2hpcuxXU5eae0ShpN5J4r6TYF5DykqeHOvlyLtenjVS', NULL, NULL, 'User', 0);

INSERT INTO Countries (CountryName) VALUES
('Netherlands'),
('England'),
('International');

INSERT INTO Seasons (SeasonName, StartDate, EndDate) VALUES
('2020-2021', '2020-08-31', '2021-06-30'),
('2021-2022', '2021-08-31', '2022-07-01');

INSERT INTO Associations (AssociationName, CountryId) VALUES
('UEFA', (SELECT CountryId FROM Countries WHERE CountryName = 'International')),
('KNVB', (SELECT CountryId FROM Countries WHERE CountryName = 'Netherlands'));

INSERT INTO Leagues (LeagueName, AssociationId, LeagueImage) VALUES
('Eredivisie', (SELECT AssociationId FROM Associations WHERE AssociationName = 'KNVB'), NULL),
('Champions League', (SELECT AssociationId FROM Associations WHERE AssociationName = 'UEFA'), NULL),
('Europa League', (SELECT AssociationId FROM Associations WHERE AssociationName = 'UEFA'), NULL);

INSERT INTO LeagueSeasons (LeagueId, SeasonId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'));

INSERT INTO UserLeagues (UserId, LeagueId) VALUES
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie')),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'));

INSERT INTO Teams (TeamName, TeamImage) VALUES
('Ajax', NULL),
('Heracles', NULL),
('FC Twente', NULL),
('Manchester City', NULL),
('PSG', NULL);

INSERT INTO TeamsInLeagues (LeagueId, SeasonId, TeamId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'));

INSERT INTO Matches (SeasonId, LeagueId, HomeTeam, AwayTeam, MatchDay, StartTime) VALUES
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 1, '2020-11-19 18:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), 2, '2020-11-19 19:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 3, '2020-11-19 20:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'), 1, '2020-11-20 20:45:00');

INSERT INTO MatchPredictions (UserId, MatchId, GoalsHomeTeam, GoalsAwayTeam) VALUES
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'bertje3'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 4),
((SELECT UserId FROM Users WHERE Username = 'bertje3'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 2),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-20 20:45:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 20:00:00'), 1, 3);

INSERT INTO MatchResults (MatchId, GoalsHomeTeam, GoalsAwayTeam) VALUES
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 3),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 4),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-20 20:45:00'), 1, 3),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 20:00:00'), 1, 1);

INSERT INTO Groups (GroupName) VALUES
('A'),
('B');

INSERT INTO TeamsInGroupsInLeagues (LeagueId, SeasonId, GroupId, TeamId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'));

INSERT INTO PointsStrategies (Creator) VALUES
((SELECT UserId FROM Users WHERE Username = 'sjaak123'));

INSERT INTO PointsOptions (OptionName) VALUES
('Fully correct'),
('Draw correct'),
('Winner correct'),
('Goals hometeam correct'),
('Goals awayteam correct');

INSERT INTO PointsStrategiesOptionPoints (StrategyId, OptionId, Points) VALUES
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Fully correct'), 10),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Draw correct'), 7),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Winner correct'), 6),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Goals hometeam correct'), 1),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Goals awayteam correct'), 1);

INSERT INTO Poules (PouleName, PouleLeague, PouleSeason, Creator, PointsStrategy, ApproveParticipants) VALUES
('Very nice poule', (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT UserId FROM Users WHERE Username = 'sjaak123'), (SELECT StrategyId FROM PointsStrategies LIMIT 1), 1),
('Collegapoule', (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT UserId FROM Users WHERE Username = 'bertje3'), (SELECT StrategyId FROM PointsStrategies LIMIT 1), 0);

INSERT INTO PouleParticipants (PouleId, UserId, Approved) VALUES
((SELECT PouleId FROM Poules WHERE PouleName = 'Very nice poule'), (SELECT UserId FROM Users WHERE Username = 'bertje3'), 1),
((SELECT PouleId FROM Poules WHERE PouleName = 'Very nice poule'), (SELECT UserId FROM Users WHERE Username = 'bertje33333'), 0);

INSERT INTO LeagueStandings (LeagueId, SeasonId, TeamId, Position) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), 1),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 2),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), 3);

INSERT INTO LeagueStandingsPredictions (UserId, LeagueId, SeasonId, TeamId, Position) VALUES
((SELECT UserId FROM Users WHERE Username = 'sjaak123'),(SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), 1),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'),(SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), 2);

INSERT INTO GroupStandings (LeagueId, SeasonId, GroupId, TeamId, Position) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City'), 1),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'), 2);

INSERT INTO GroupStandingsPredictions (UserId, LeagueId, SeasonId, GroupId, TeamId, Position) VALUES
((SELECT UserId FROM Users WHERE Username = 'sjaak123'),(SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City'), 1),
((SELECT UserId FROM Users WHERE Username = 'sjaak123'),(SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'), 2);

SELECT * FROM GroupStandingsPredictions;
SELECT * FROM GroupStandings;
SELECT * FROM LeagueStandingsPredictions;
SELECT * FROM LeagueStandings;
SELECT * FROM PouleParticipants;
SELECT * FROM Poules;
SELECT * FROM PointsStrategiesOptionPoints;
SELECT * FROM PointsOptions;
SELECT * FROM PointsStrategies;
SELECT * FROM TeamsInGroupsInLeagues;
SELECT * FROM Groups;
SELECT * FROM MatchResults;
SELECT * FROM MatchPredictions;
SELECT * FROM Matches;
SELECT * FROM TeamsInLeagues;
SELECT * FROM Teams;
SELECT * FROM UserLeagues;
SELECT * FROM LeagueSeasons;
SELECT * FROM Leagues;
SELECT * FROM Associations;
SELECT * FROM Seasons;
SELECT * FROM Countries;
SELECT * FROM Users;
SELECT * FROM Roles;
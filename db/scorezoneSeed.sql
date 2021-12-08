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
('testadmin@email.com', 'testadmin', '$2a$12$UVJoUm.YS7GW4S95N0AEC.4yWxKnVI1VsVMBqCj5KUOHC4DEFf3pe', 'Admin', 'Test', 'Admin', 1),
('testuser@email.com', 'testuser', '$2a$12$7wjLZZWvbaotGczvvD9ibeSqrtr9sRUJ0D0TVYBxNxVGFYxejusB.', 'User', 'Test', 'User', 1),
('testuser2@email.com', 'testuser2', '$2a$12$IAapBW3bN1Y6X3Kl1XsLW./hAO9e7R3imZS/lSMFUM2JNuqju2Eie', NULL, NULL, 'User', 0);

INSERT INTO Countries (CountryName) VALUES
('Netherlands'),
('England'),
('International');

INSERT INTO Seasons (SeasonName, StartDate, EndDate) VALUES
('2020-2021', '2020-07-01', '2021-06-30'),
('2021-2022', '2021-07-01', '2022-06-30');

INSERT INTO Associations (AssociationName, CountryId) VALUES
('UEFA', (SELECT CountryId FROM Countries WHERE CountryName = 'International')),
('FA', (SELECT CountryId FROM Countries WHERE CountryName = 'England')),
('KNVB', (SELECT CountryId FROM Countries WHERE CountryName = 'Netherlands'));

INSERT INTO Leagues (LeagueName, AssociationId, LeagueImage) VALUES
('Eredivisie', (SELECT AssociationId FROM Associations WHERE AssociationName = 'KNVB'), NULL),
('Champions League', (SELECT AssociationId FROM Associations WHERE AssociationName = 'UEFA'), NULL),
('Premier League', (SELECT AssociationId FROM Associations WHERE AssociationName = 'FA'), NULL);

INSERT INTO LeagueSeasons (LeagueId, SeasonId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Premier League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'));

INSERT INTO UserLeagues (UserId, LeagueId) VALUES
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie')),
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'));

INSERT INTO Teams (TeamName, TeamImage) VALUES
('Ajax', NULL),
('Heracles', NULL),
('FC Twente', NULL),
('Manchester City', NULL),
('Manchester United', NULL),
('PSG', NULL);

INSERT INTO TeamsInLeagues (LeagueId, SeasonId, TeamId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'));

INSERT INTO Matches (SeasonId, LeagueId, HomeTeam, AwayTeam, MatchDay, StartTime) VALUES
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 1, '2020-11-19 18:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), 2, '2020-11-19 19:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 3, '2020-11-19 20:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'), 1, '2020-11-20 20:45:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'Heracles'), 1, '2021-12-23 18:00:00'),
((SELECT SeasonId FROM SEASONS WHERE SeasonName = '2021-2022'), (SELECT LeagueId FROM Leagues WHERE LeagueName = 'Eredivisie'), (SELECT TeamId FROM Teams WHERE TeamName = 'Ajax'), (SELECT TeamId FROM Teams WHERE TeamName = 'FC Twente'), 2, '2022-01-19 19:00:00');

INSERT INTO MatchPredictions (UserId, MatchId, GoalsHomeTeam, GoalsAwayTeam) VALUES
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 20:00:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'testuser'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 4),
((SELECT UserId FROM Users WHERE Username = 'testuser'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 2),
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT MatchId FROM Matches WHERE StartTime = '2020-11-20 20:45:00'), 1, 3),
((SELECT UserId FROM Users WHERE Username = 'testadmin'), (SELECT MatchId FROM Matches WHERE StartTime = '2021-12-23 18:00:00'), 1, 3);

INSERT INTO MatchResults (MatchId, GoalsHomeTeam, GoalsAwayTeam) VALUES
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 18:00:00'), 1, 3),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 19:00:00'), 1, 4),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-20 20:45:00'), 1, 3),
((SELECT MatchId FROM Matches WHERE StartTime = '2020-11-19 20:00:00'), 1, 1);

INSERT INTO Groups (GroupName) VALUES
('A'),
('B'),
('C'),
('D'),
('E'),
('F'),
('G'),
('H');

INSERT INTO TeamsInGroupsInLeagues (LeagueId, SeasonId, GroupId, TeamId) VALUES
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'Manchester City')),
((SELECT LeagueId FROM Leagues WHERE LeagueName = 'Champions League'), (SELECT SeasonId FROM SEASONS WHERE SeasonName = '2020-2021'), (SELECT GroupId FROM Groups WHERE GroupName = 'A'), (SELECT TeamId FROM Teams WHERE TeamName = 'PSG'));

INSERT INTO PointsStrategies (Creator) VALUES
((SELECT UserId FROM Users WHERE Username = 'testadmin'));

INSERT INTO PointsOptions (OptionName) VALUES
('Total score correct'),
('Draw correct'),
('Winner correct'),
('Number of home goals correct'),
('Number of away goals correct');

INSERT INTO PointsStrategiesOptionPoints (StrategyId, OptionId, Points) VALUES
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Total score correct'), 10),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Draw correct'), 7),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Winner correct'), 6),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Number of home goals correct'), 1),
((SELECT StrategyId FROM PointsStrategies LIMIT 1), (SELECT OptionId FROM PointsOptions WHERE OptionName = 'Number of away goals correct'), 1);

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
DELIMITER ;;
CREATE TRIGGER `poules_before_insert` 
BEFORE INSERT ON `Poules` FOR EACH ROW 
BEGIN
  IF new.JoinCode IS NULL THEN
    SET new.JoinCode = uuid();
  END IF;
END;;
DELIMITER ;
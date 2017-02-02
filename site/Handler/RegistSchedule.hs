module Handler.RegistSchedule where

import Import
import Database.Persist.Sql
import Data.Text as Text

-- insert schedule date into Schedle Table with JSON.
postRegistScheduleR :: Handler ()
postRegistScheduleR = do
  s <- requireJsonBody :: Handler Schedule
  k <- runDB $ insert s
  sendResponseStatus status201 (Text.pack $ show $ fromSqlKey(k))

-- get schedule data for login's user.
getRegistScheduleR :: Handler Value
getRegistScheduleR = do
  -- memberid must be changed login user id.
  schedules <- runDB $ selectList [ScheduleMemberid ==. 1] [Desc ScheduleStartdatetime] :: Handler [Entity Schedule]
  return $ object ["schedule" .= schedules]

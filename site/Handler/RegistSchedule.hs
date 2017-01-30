module Handler.RegistSchedule where

import Import

-- insert schedule date into Schedle Table with JSON.
postRegistScheduleR :: Handler ()
postRegistScheduleR = do
  schedule <- requireJsonBody :: Handler Schedule
  _ <- runDB $ insertUnique schedule
  sendResponseStatus status201 ("CREATED" :: Text)

-- get schedule data for login's user.
getRegistScheduleR :: Handler Value
getRegistScheduleR = do
  -- memberid must be changed login user id.
  schedules <- runDB $ selectList [ScheduleMemberid ==. 1] [Desc ScheduleStartdatetime] :: Handler [Entity Schedule]
  return $ object ["schedule" .= schedules]

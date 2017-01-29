module Handler.FilterSchedule where

import Import
-- import Database.Persist.Sql

-- get scedule data from Schedule Table.
-- return JSON Format.
getFilterScheduleR :: ScheduleId -> Handler Schedule
getFilterScheduleR schedule_id = error "Not yet implemented: getFileterScheduleR"

putFilterScheduleR :: ScheduleId -> Handler Html
putFilterScheduleR schedule_id = do
  schedule <- requireJsonBody :: Handler Schedule
  -- _ <- runDB $ replace (toSqlKey (fromIntegral schedule_id)) schedule
  _ <- runDB $ replace schedule_id schedule
  sendResponseStatus status201 ("Updated" :: Text)

deleteFilterScheduleR :: ScheduleId -> Handler Html
deleteFilterScheduleR schedule_id = error "Not yet implemented: deleteFilterScheduleR"

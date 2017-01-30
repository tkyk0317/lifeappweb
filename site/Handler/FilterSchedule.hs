module Handler.FilterSchedule where

import Import

-- get scedule data from Schedule Table.
-- return JSON Format.
getFilterScheduleR :: ScheduleId -> Handler Html
getFilterScheduleR schedule_id = error "Not yet implemented: getFileterScheduleR"

-- update schedule.
putFilterScheduleR :: ScheduleId -> Handler Value
putFilterScheduleR schedule_id = do
  schedule <- requireJsonBody :: Handler Schedule
  _ <- runDB $ replace schedule_id schedule
  sendResponseStatus status201 ("Updated" :: Text)

deleteFilterScheduleR :: ScheduleId -> Handler Html
deleteFilterScheduleR schedule_id = error "Not yet implemented: deleteFilterScheduleR"

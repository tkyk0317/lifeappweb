module Handler.FilterSchedule where

import Import

-- get scedule data from Schedule Table.
-- return JSON Format.
getFilterScheduleR :: Int -> Handler Value
getFilterScheduleR memberid = do
  schedules <- runDB $ selectList [ScheduleMemberid ==. memberid] [] :: Handler [Entity Schedule]
  return $ object ["schedule" .= schedules]

updateFilterScheduleR :: Int -> Handler Html
updateFilterScheduleR memberid = error "Not yet implemented: updateFilterScheduleR"

deleteFilterScheduleR :: Int -> Handler Html
deleteFilterScheduleR memberid = error "Not yet implemented: deleteFilterScheduleR"

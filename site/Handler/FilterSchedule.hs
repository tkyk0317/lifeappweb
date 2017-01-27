module Handler.FilterSchedule where

import Import

-- get scedule data from Schedule Table.
-- return JSON Format.

-- この関数は、現状、memberidを引数に取っているが、
-- Scheduleテーブルのidを引数とするべき.
-- memberidを引数に持つ関数は、RegistSchedule.hs::getRegistScheduleRとするべき.
getFilterScheduleR :: Int -> Handler Value
getFilterScheduleR memberid = do
  schedules <- runDB $ selectList [ScheduleMemberid ==. memberid] [Desc ScheduleStartdatetime] :: Handler [Entity Schedule]
  return $ object ["schedule" .= schedules]

updateFilterScheduleR :: Int -> Handler Html
updateFilterScheduleR memberid = error "Not yet implemented: updateFilterScheduleR"

deleteFilterScheduleR :: Int -> Handler Html
deleteFilterScheduleR memberid = error "Not yet implemented: deleteFilterScheduleR"

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
  -- get login-id,
  ident <- lookupSession "login_key"
  case ident of
    Just i -> do
      record <- runDB $ selectFirst [MemberIdent ==. i] []
      case record of
        Just (Entity uid _) -> do
          -- memberid must be changed login user id.
          let _id = fromSqlKey(uid)
          schedules <- runDB $ selectList [ScheduleMemberid ==. fromIntegral(_id)] [Desc ScheduleStartdatetime] :: Handler [Entity Schedule]
          return $ object [ "memberid" .= _id
                           ,"schedule" .= schedules
                          ]

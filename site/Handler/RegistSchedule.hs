module Handler.RegistSchedule where

import Import

-- insert schedule date into Schedle Table with JSON.
postRegistScheduleR :: Handler ()
postRegistScheduleR = do
  schedule <- requireJsonBody :: Handler Schedule
  _ <- runDB $ insert schedule
  sendResponseStatus status201 ("CREATED" :: Text)

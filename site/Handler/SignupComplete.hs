module Handler.SignupComplete where

import Import

getSignupCompleteR :: Handler Html
getSignupCompleteR = do
  defaultLayout $ do $(widgetFile "signupcomplete")

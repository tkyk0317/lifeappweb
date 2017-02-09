module Handler.Signout where

import Import

getSignoutR :: Handler Html
getSignoutR = do
  deleteSession "login_key"
  redirect $ AuthR LoginR

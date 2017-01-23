module Handler.Signin where

import Import
import Data.Text as Text

-- login user and password.
postSigninR :: Handler Html
postSigninR = do
  input_email <- runInputPost $ iopt textField "email"
  input_password <- takeoutPassword

  -- search record from Member table.
  login_info <- runDB $ selectFirst [MemberEmail ==. input_email] []
  case login_info of
    -- get password from Entity.
    Just info -> case (memberPassword $ entityVal info) of
                  Just passwd -> case passwd == shaPassword input_password of
                                  True -> correctPassword
                                  _ -> notCorrectPassword
                                  where
                                    shaPassword p = toString $ generateSha512 p
                                    correctPassword = do
                                      deleteSession "login_error"
                                      redirect HomeR
                                    notCorrectPassword = do
                                      setSession "login_error" "Please input corrcet password"
                                      redirect $ AuthR LoginR
                                    toString s = Text.pack $ show $ s
                  Nothing -> illegal
                    where
                      illegal = do
                        setSession "login_error" "Illegal Error"
                        redirect $ AuthR LoginR
    _ -> notFoundRecord
      where
        notFoundRecord = do
          setSession "login_error" "Please input corrent email address"
          redirect $ AuthR LoginR

-- take out password from form.
takeoutPassword :: (RenderMessage (HandlerSite m) FormMessage, MonadHandler m) => m Text
takeoutPassword = do
  password <- runInputPost $ iopt passwordField "password"
  case password of
    Just p -> return p
    Nothing -> return ""

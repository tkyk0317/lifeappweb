module Handler.Signup where

import Import
import Data.Text as Text

-- signup form.
getSignupR :: Handler Html
getSignupR = do
  defaultLayout $ do
    let signup_error = Nothing :: Maybe String
    $(widgetFile "signup")

-- create account record.
postSignupR :: Handler Html
postSignupR = do
  firstname <- runInputPost $ ireq textField "firstname"
  lastname <- runInputPost $ ireq textField "lastname"
  email <- runInputPost $ ireq textField "email"
  password <- runInputPost $ ireq passwordField "password"
  password_confirm <- runInputPost $ ireq passwordField "password_confirm"

  -- check duplicated email.
  let ident = toString $ generateMD5 email
  record <- runDB $ getBy $ UniqueMember ident
  case record of
    Just _ -> do
        -- alredy exists.
        let signup_error = Just "Accouont already exists" :: Maybe String
        defaultLayout $ do $(widgetFile "signup")
    Nothing -> do
        -- new record.
        let sha_password = toString $ generateSha512 password
        -- check password and password_confirm.
        case password == password_confirm of
          False -> do
            let signup_error = Just "Differ password and confirm password" :: Maybe String
            defaultLayout $ do $(widgetFile "signup")
          _ -> do
            -- insert into member table.
            _ <- runDB $ insertBy $ Member { memberIdent = ident
                                           , memberFirstname = Just firstname
                                           , memberLastname = Just lastname
                                           , memberEmail = Just email
                                           , memberPassword = Just sha_password
                                           }
            redirect SignupCompleteR
  where
    toString t = Text.pack $ show t

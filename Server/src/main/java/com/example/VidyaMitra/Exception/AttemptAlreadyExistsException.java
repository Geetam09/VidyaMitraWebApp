package com.example.VidyaMitra.Exception;

import java.net.PortUnreachableException;
import java.security.PublicKey;

public class AttemptAlreadyExistsException extends RuntimeException{
    public AttemptAlreadyExistsException(String message){
        super(message);
    }
}

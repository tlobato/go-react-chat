package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"golang.org/x/net/websocket"
)

type Message struct {
	User string `json:"user"`
	Msg  string `json:"msg"`
}

type Server struct {
	conns map[*websocket.Conn]bool
}

func newServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) handleSocket(ws *websocket.Conn) {
	fmt.Println("incomming connection from client", ws.RemoteAddr())

	s.conns[ws] = true

	s.readLoop(ws)
}

func (s *Server) readLoop(ws *websocket.Conn) {
	buff := make([]byte, 1024)
	for {
		n, err := ws.Read(buff)
		if err != nil {
			if err == io.EOF { //if user disconnected
				fmt.Println("client disconnected")
				delete(s.conns, ws)
				break
			}
			fmt.Println("websocket reading error: ", err)
			continue
		}

		JSON := buff[:n]
		var msg Message
		err = json.Unmarshal(JSON, &msg)
		if err != nil {
			fmt.Println("JSON unmarshalling error:", err)
			continue
		}

		broadcastData, _ := json.Marshal(msg)
		s.broadcast(broadcastData)
	}
}

func (s *Server) broadcast(msg []byte) {
	for ws := range s.conns {
		go func(ws *websocket.Conn) {
			_, err := ws.Write(msg)
			if err != nil {
				fmt.Println("error broadcasting:", err)
			}
		}(ws)
	}
}

func main() {
	server := newServer()

	http.Handle("/ws", websocket.Handler(server.handleSocket))
	http.ListenAndServe(":3333", nil)
}

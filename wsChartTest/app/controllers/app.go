package controllers

import (
	"code.google.com/p/go.net/websocket"
	"github.com/revel/revel"
	//"math/rand"
	"math"
	"strconv"
	"time"
)

const (
	deftime = 200
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	return c.Render(deftime)
}

func (c App) WsCon(ws *websocket.Conn) revel.Result {

	tickTime := make(chan int)
	go func() {
		var msg string
		for {
			err := websocket.Message.Receive(ws, &msg)
			if err != nil {
				return
			}

			tick, err := strconv.Atoi(msg)
			if err == nil && tick > 0 {
				tickTime <- tick
			}
		}
	}()

	tickWait := time.NewTicker(deftime * time.Millisecond)
	defer tickWait.Stop()
	count := 0.0
	var points [3]int
	for {
		select {
		case <-tickWait.C:
			if websocket.JSON.Send(ws, &points) != nil {
				return nil
			}

			sin := math.Sin(2 * math.Pi * count * 13)
			cos := math.Cos(2 * math.Pi * count * 17)

			//points[0] = int((sin + 1) * 50)
			//points[1] = int((cos + 1) * 50)
			//points[2] = int((sin + cos + 2) * 25)

			points[0] = int((sin + cos + 2) * 25)
			points[1] = int((sin - cos + 2) * 25)
			points[2] = int(((sin * cos) + 1) * 50)

			count += 1e-3
			if count >= 1 {
				count -= 1
			}

		case t := <-tickTime:
			tickWait.Stop()
			tickWait = time.NewTicker(time.Duration(t) * time.Millisecond)
		}
	}
	return nil
}

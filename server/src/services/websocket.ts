import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { logger } from '../utils/logger'

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string
  isAlive: boolean
}

export class WebSocketService {
  private wss: WebSocketServer
  private clients: Set<AuthenticatedWebSocket> = new Set()

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    })

    this.setupConnectionHandler()
    this.startHeartbeat()
  }

  private setupConnectionHandler() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, request) => {
      // Authenticate connection
      const token = this.extractToken(request)
      if (!token) {
        ws.close(1008, 'Authentication required')
        return
      }

      try {
        const decoded = jwt.verify(token, config.jwtSecret) as any
        ws.userId = decoded.userId
        ws.isAlive = true

        this.clients.add(ws)
        logger.info(`WebSocket client connected: ${decoded.userId}`)

        // Send welcome message
        this.sendToClient(ws, {
          type: 'welcome',
          data: { message: 'Connected to real-time service' }
        })

        // Broadcast user joined to other clients (for admin purposes)
        this.broadcastToAdmins({
          type: 'user_connected',
          data: { userId: decoded.userId, timestamp: new Date().toISOString() }
        })

        ws.on('pong', () => {
          ws.isAlive = true
        })

        ws.on('message', (data) => {
          this.handleMessage(ws, data)
        })

        ws.on('close', () => {
          this.clients.delete(ws)
          logger.info(`WebSocket client disconnected: ${decoded.userId}`)
        })

        ws.on('error', (error) => {
          logger.error('WebSocket error:', error)
          this.clients.delete(ws)
        })

      } catch (error) {
        ws.close(1008, 'Invalid token')
      }
    })
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization']
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }

  private handleMessage(ws: AuthenticatedWebSocket, data: Buffer) {
    try {
      const message = JSON.parse(data.toString())
      
      switch (message.type) {
        case 'ping':
          this.sendToClient(ws, { type: 'pong', data: { timestamp: new Date().toISOString() } })
          break
        
        case 'subscribe':
          this.handleSubscribe(ws, message)
          break
        
        default:
          logger.warn('Unknown message type:', message.type)
      }
    } catch (error) {
      logger.error('Error handling WebSocket message:', error)
    }
  }

  private handleSubscribe(ws: AuthenticatedWebSocket, message: any) {
    // Implement subscription logic for different channels
    this.sendToClient(ws, {
      type: 'subscribed',
      data: { channels: message.channels }
    })
  }

  private startHeartbeat() {
    const interval = setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate()
          this.clients.delete(ws)
          return
        }

        ws.isAlive = false
        ws.ping()
      })
    }, 30000)

    this.wss.on('close', () => {
      clearInterval(interval)
    })
  }

  public sendToClient(ws: AuthenticatedWebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  public broadcastToUser(userId: string, message: any) {
    this.clients.forEach((client) => {
      if (client.userId === userId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }

  public broadcastToAdmins(message: any) {
    // In a real app, you'd check user roles from database
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }

  public broadcastToAll(message: any) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }

  public getConnectedClients(): number {
    return this.clients.size
  }
}
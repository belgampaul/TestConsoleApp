package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.ETennisGameType;
import be.belgampaul.tennis.domain.Player;
import org.apache.log4j.Logger;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 4:28 PM
 */
abstract public class AbstractTennisMatchObject<Parent extends ITennisMatch, Child extends ITennisMatch> extends AbstractTennisObject<Parent> implements ITennisMatch {
  //logger
  private static final Logger log = Logger.getLogger(AbstractTennisMatchObject.class);

  //constants
  private static final String METHOD_GET_PLAYER_2 = "getPlayer2";
  private static final String METHOD_GET_PLAYER_1 = "getPlayer1";
  protected ETennisGameType gameType;

  //service data
  protected Player toServeFirst;
  protected Player toReceiveFirst;
  protected Player currentServer;

  protected LinkedList<Child> children;


  protected AbstractTennisMatchObject(Long id, Parent o) {
    super(id, o);
    children = new LinkedList<>();
  }

  @Override
  public Player getPlayer1() {
    return parent.getPlayer1();
  }




  @Override
  public Player getPlayer2() {
    try {
      Method getPlayer1 = parent.getClass().getMethod(METHOD_GET_PLAYER_2);
      Object invoke = getPlayer1.invoke(parent);
      return (Player) invoke;
    } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
      log.debug("", e);
    }
    return null;
  }

  public Player getToServeFirst() {
    return toServeFirst;
  }

  public void setToServeFirst(Player toServeFirst) {
    this.toServeFirst = toServeFirst;
  }

  public Player getToReceiveFirst() {
    return toReceiveFirst;
  }

  public void setToReceiveFirst(Player toReceiveFirst) {
    this.toReceiveFirst = toReceiveFirst;
  }

  public Player getCurrentServer() {
    return currentServer;
  }

  public void setCurrentServer(Player currentServer) {
    this.currentServer = currentServer;
  }

  @Override
  public Boolean isCompleted() {
    return getWinner() != null;
  }

  @Override
  public Point getCurrentPoint() {
    Child last = null;
    try {
      last = children.getLast();
      return last.getCurrentPoint();
    } catch (NoSuchElementException e){
      log.debug("No current point available" ,e);
    }
    return null;
  }

  public void init(Player serveFirst, Player receiveFirst){
    toReceiveFirst = receiveFirst;
    toServeFirst = serveFirst;
    currentServer = toServeFirst;
  }

  protected PropertyChangeListener propertyChangeListener = new PropertyChangeListener() {
    @Override
    public void propertyChange(PropertyChangeEvent evt) {
      if ("winner".equals(evt.getPropertyName())) {
        AbstractTennisMatchObject.this.calculateResult();
      }
    }
  };

  @Override
  public String getPlayer1Score() {
    return getPlayerScore(getPlayer1());
  }

  @Override
  public String getPlayer2Score() {
    return getPlayerScore(getPlayer2());
  }

  public String getPlayerScore(Player player){
    int score = 0;
    for (Child child : children) {
      if (!child.isCompleted()){
        break;
      }
      if (player.equals(child.getWinner())){
        score++;
      }
    }
    return String.valueOf(score);
  }
}

package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.DomainObject;
import be.belgampaul.tennis.domain.Player;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 3:47 AM
 */
abstract public class AbstractTennisObject<Parent> extends DomainObject implements ITennis {
  protected Parent parent;
  protected PropertyChangeSupport changes = new PropertyChangeSupport(this);
  private Player winner;


  @Override
  final public Parent getParent() {
    return parent;
  }

  protected AbstractTennisObject(Long id, Parent parent) {
    super(id);
    this.parent = parent;
  }

  public void addPropertyChangeListener(PropertyChangeListener l) {
    changes.addPropertyChangeListener(l);
  }

  public void removePropertyChangeListener(PropertyChangeListener l) {
    changes.removePropertyChangeListener(l);
  }

  final public void setWinner(Player winner) {
    if (this.winner != null) {
      throw new UnsupportedOperationException("The " + this.getClass().getSimpleName() + " has already a winner " + winner);
    }

    if (winner == null) {
      throw new UnsupportedOperationException(this.getClass().getSimpleName() + " winner cannot be null");
    }
    this.winner = winner;
    calculateResult();
    changes.firePropertyChange("winner", null /*no winner before*/, winner);
  }

  protected abstract void calculateResult();

  final public Player getWinner() {
    return winner;
  }
}

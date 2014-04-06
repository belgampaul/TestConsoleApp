package be.belgampaul.tennis.domain;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 7:35 PM
 */
public class MatchTest {
  private Match match;
  private Player player1;
  private Player player2;

  @Before
  public void setUp() throws Exception {
    System.out.println("");
    System.out.println("begin setting up >>>>>");
    player1 = new Player("i1", "i1");
    player2 = new Player("i2", "i2");
    match = new Match(1L, player1, player2);
    System.out.println("<<<<< end setting up");
    System.out.println("");
  }

  @After
  public void tearDown() throws Exception {

  }

  @Test
  public void testCreateNewPoint() throws Exception {
    int totalPoints = match.getTotalPointsPlayed();

    Point newPoint = match.createNewPoint();
    System.out.println("totalPoints: " + totalPoints);
    System.out.println(newPoint);

    match.setPlayer1AsPointWinner();
    System.out.println("totalPoints: " + match.getTotalPointsPlayed());
  }

  @Test
  public void testSetPlayer1AsPointWinner() throws Exception {
    System.out.println(match);
  }

  @Test
  public void testSetPlayer2AsPointWinner() throws Exception {
    System.out.println(match);
  }

  @Test
  public void testIsCompleted() throws Exception {
    System.out.println(match);
  }
}

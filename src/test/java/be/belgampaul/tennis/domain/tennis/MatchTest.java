package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.Player;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 5:44 PM
 */
public class MatchTest {
  private Match match;
  private Player player1;
  private Player player2;

  @Before
  public void setUp() throws Exception {
    // System.out.println("");
    // System.out.println("begin setting up >>>>>");
    player1 = new Player("i1", "i1");
    player2 = new Player("i2", "i2");
    match = new Match(1L, null, player1, player2);
    //System.out.println("<<<<< end setting up");
    //System.out.println("");
  }

  @After
  public void tearDown() throws Exception {

  }

  @Test
  public void testCalculateResult() throws Exception {

  }

  @Test
  public void testGetPlayer1() throws Exception {
    Assert.assertEquals(match.getPlayer1(), new Player("i1", "i1"));

  }

  @Test
  public void testSetPlayer1() throws Exception {

  }

  @Test
  public void testGetPlayer2() throws Exception {
    Assert.assertEquals(match.getPlayer2(), new Player("i2", "i2"));
  }

  @Test
  public void testGetCurrentServer() throws Exception {

  }

  @Test
  public void testSetPlayer2() throws Exception {

  }

  @Test
  public void testSetCurrentPointWinner() {
    match.init(player1, player2);


    for (int i = 0; i < 300; i++) {
      if (match.isCompleted()) {
        break;
      }
      if (Math.floor(Math.random() * 100) % 2 == 0) {
        match.setCurrentPointWinner(player1);

      } else {
        match.setCurrentPointWinner(player2);
      }
      System.out.println(match.getStrictScore());
    }


  }
}

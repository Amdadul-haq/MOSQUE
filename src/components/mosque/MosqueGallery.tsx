// src/components/mosque/MosqueGallery.tsx - Fixed version
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useTheme, Text, Card } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width: screenWidth } = Dimensions.get("window");

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface MosqueGalleryProps {
  images: GalleryImage[];
}

export const MosqueGallery: React.FC<MosqueGalleryProps> = ({ images }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null); // Fixed: initialized with null

  // Auto-slide functionality
  useEffect(() => {
    if (images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [images.length]);

  // Scroll to current index when auto-slide changes
  useEffect(() => {
    if (flatListRef.current && images.length > 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, images.length]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  if (images.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.emptyContent}>
          <MaterialCommunityIcons
            name="image-off"
            size={48}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            No photos available
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Section Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="image-multiple"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Mosque Gallery
            </Text>
          </View>
          <View style={styles.counter}>
            <Text style={[styles.counterText, { color: theme.colors.primary }]}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <Animated.FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageTitle}>{item.title}</Text>
                    <Text style={styles.imageDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.arrowButton, styles.arrowLeft]}
                onPress={() =>
                  goToSlide(
                    currentIndex > 0 ? currentIndex - 1 : images.length - 1
                  )
                }
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.arrowButton, styles.arrowRight]}
                onPress={() =>
                  goToSlide(
                    currentIndex < images.length - 1 ? currentIndex + 1 : 0
                  )
                }
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                  },
                ]}
                onPress={() => goToSlide(index)}
              />
            ))}
          </View>
        )}

        {/* Auto-play Indicator */}
        {images.length > 1 && (
          <View style={styles.autoPlayIndicator}>
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.autoPlayText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Auto-playing every 5s
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  content: {
    padding: 0,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  counter: {
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  carouselContainer: {
    position: "relative",
  },
  imageContainer: {
    width: screenWidth - 32,
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
  },
  imageInfo: {
    gap: 2,
  },
  imageTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imageDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  autoPlayIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    gap: 4,
  },
  autoPlayText: {
    fontSize: 12,
  },
});
